import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { PermissionFlagsBits, TextChannel, type Message } from 'discord.js';
import { getAutomodConfig } from '@configs/automodConfig';
import { hasAnyPerms } from '@functions/discord';
import AutomodStrike from '@schemas/Automod-Strike';
import { actionAutomod } from '@functions/automodUtils';

export default {
  event: 'messageCreate',
  name: 'excessiveCapsAutomod',
  async execute({ client, color }: EventArgs, message: Message) {
    if (message.author.bot) return;
    if (!message.guildId) return;
    if (!message.guild) return;

    const config = await getAutomodConfig(message.guildId, client);
    if (!config) return;

    if (!config.enabled || !config.excessiveCaps.enabled) return;

    //* Detect if the message contains more that percentage caps
    const capsRegex = /[A-Z]/g;
    const caps = message.content.match(capsRegex);
    if (!caps) return;
    const percentage = (caps.length / message.content.length) * 100;
    if (percentage < config.excessiveCaps.percentage) return;

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

    //* Delete the invite
    if (message.deletable) await message.delete();

    //* Send the alert message (if enabled)
    if (config.excessiveCaps.alert) {
      const alertMessage = await message.channel.send({
        embeds: [
          new Embed(color)
            .setDescription(
              `Hey ${message.author}, please limit use of CAPS in your messages! Your message has been deleted.`,
            )
            .setFooter({ text: `This message will be deleted in ${config.excessiveCaps.deleteAlertAfter} seconds.` }),
        ],
        content: `<@${message.author.id}>`,
      });
      setTimeout(() => {
        if (alertMessage.deletable) alertMessage.delete();
      }, config.excessiveCaps.deleteAlertAfter * 1000);
    }

    //* Save action to DB
    const newStrike = new AutomodStrike({
      guildId: message.guildId,
      userId: message.author.id,
      type: 'excessive-caps',
      date: new Date(),
    });
    await newStrike.save();

    //* Log the action
    const logChannel = message.guild.channels.cache.get(config.logChannel) as TextChannel;
    if (logChannel && config.logsEnabled) {
      const totalStrikes = await AutomodStrike.countDocuments({ guildId: message.guildId, userId: message.author.id });
      const capsStrikes = await AutomodStrike.countDocuments({
        guildId: message.guildId,
        userId: message.author.id,
        type: 'excessive-caps',
      });
      logChannel.send({
        embeds: [
          new Embed(color)
            .setAuthor({ name: 'Excessive Caps Message Deleted' })
            .setDescription(
              [
                `**User**: ${message.author} (${message.author.username})`,
                `**Channel**: ${message.channel.toString()} (${message.channelId})`,
                `**Total Automod Strikes**: ${totalStrikes}`,
                `**Total Excessive Caps Strikes**: ${capsStrikes}`,
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
			config.excessiveCaps.action,
			config.excessiveCaps.duration,
			'Automatically punished after being flagged by automod, sent a message with excessive caps.'
		);
  },
};