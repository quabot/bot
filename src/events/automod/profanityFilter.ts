import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { PermissionFlagsBits, TextChannel, type Message } from 'discord.js';
import { getAutomodConfig } from '@configs/automodConfig';
import { hasAnyPerms } from '@functions/discord';
import AutomodStrike from '@schemas/Automod-Strike';
import { actionAutomod } from '@functions/automodUtils';
import { profanity } from '@2toad/profanity';
profanity.addWords(['kut', 'kanker']);

export default {
  event: 'messageCreate',
  name: 'profanityFilterAutomod',
  async execute({ client, color }: EventArgs, message: Message) {
    if (message.author.bot) return;
    if (!message.guildId) return;
    if (!message.guild) return;

    const config = await getAutomodConfig(message.guildId, client);
    if (!config) return;

    if (!config.enabled || !config.profanityFilter.enabled) return;

    //* Detect if the message contains profanity
    profanity.addWords(config.profanityFilter.extraWords);
    profanity.removeWords(config.profanityFilter.removedWords);

    if (!profanity.exists(message.content)) return;

    //* Check if the user has the bypass permission
    const member =
      message.guild?.members.cache.get(message.author.id) ??
      (await message.guild?.members.fetch(message.author.id).catch(() => null));
    if (!member) return;

    //* Member has Admin or Manage Server permissions
    if (
      hasAnyPerms(member, [
        PermissionFlagsBits.Administrator,
        PermissionFlagsBits.ManageGuild,
        PermissionFlagsBits.ManageMessages,
      ])
    )
      return;

    //* Check the ignored channels & roles
    if (
      config.ignoredChannels.includes(message.channelId) ||
      member.roles.cache.some(role => config.ignoredRoles.includes(role.id))
    )
      return;

    if (message.deletable) await message.delete().catch(() => {});

    //* Send the alert message (if enabled)
    if (config.profanityFilter.alert) {
      const alertMessage = await message.channel.send({
        embeds: [
          new Embed(color)
            .setDescription(`Hey ${message.author}, please do not swear! Your message has been deleted.`)
            .setFooter({ text: `This message will be deleted in ${config.profanityFilter.deleteAlertAfter} seconds.` }),
        ],
        content: `<@${message.author.id}>`,
      });
      setTimeout(() => {
        if (alertMessage.deletable) alertMessage.delete();
      }, config.profanityFilter.deleteAlertAfter * 1000);
    }

    //* Save action to DB
    const newStrike = new AutomodStrike({
      guildId: message.guildId,
      userId: message.author.id,
      type: 'profanity',
      date: new Date(),
    });
    await newStrike.save();

    //* Log the action
    const logChannel = message.guild.channels.cache.get(config.logChannel) as TextChannel;
    if (logChannel && config.logsEnabled) {
      const totalStrikes = await AutomodStrike.countDocuments({ guildId: message.guildId, userId: message.author.id });
      const profanityStrikes = await AutomodStrike.countDocuments({
        guildId: message.guildId,
        userId: message.author.id,
        type: 'profanity',
      });
      logChannel.send({
        embeds: [
          new Embed(color)
            .setAuthor({ name: 'Message With Profanity Deleted' })
            .setDescription(
              [
                `**User**: ${message.author} (${message.author.username})`,
                `**Channel**: ${message.channel.toString()} (${message.channelId})`,
                `**Total Automod Strikes**: ${totalStrikes}`,
                `**Total Profanity Strikes**: ${profanityStrikes}`,
                `**Message Content**: ${message.content}`,
              ]
                .join('\n')
                .substring(0, 1024),
            ),
        ],
      });
    }

    //* Do the action if configured
    await actionAutomod(
      client,
      member,
      config.profanityFilter.action,
      config.profanityFilter.duration,
      'Automatically punished after being flagged by automod, sent a message with swear words.',
    );
  },
};
