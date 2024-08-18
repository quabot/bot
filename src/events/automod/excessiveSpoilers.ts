import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { PermissionFlagsBits, TextChannel, type Message } from 'discord.js';
import { getAutomodConfig } from '@configs/automodConfig';
import { hasAnyPerms } from '@functions/discord';
import AutomodStrike from '@schemas/Automod-Strike';
import { actionAutomod } from '@functions/automodUtils';

export default {
  event: 'messageCreate',
  name: 'excessiveSpoilersAutomod',
  async execute({ client, color }: EventArgs, message: Message) {
    if (message.author.bot) return;
    if (!message.guildId) return;
    if (!message.guild) return;

    const config = await getAutomodConfig(message.guildId, client);
    if (!config) return;

    if (!config.enabled || !config.excessiveSpoilers.enabled) return;

    //* Detect what percentage of the message is a spoiler (between || on both sides), if below max return. Spoilers should include the text betwee them
    const spoilerRegex = /\|\|.*?\|\|/g;
    const spoilers = message.content.match(spoilerRegex);
    if (!spoilers) return;
    const spoilerLength = spoilers.reduce((acc, spoiler) => acc + spoiler.length, 0);
    const percentage = (spoilerLength / message.content.length) * 100;
    if (percentage < config.excessiveSpoilers.percentage) return;

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
    if (config.excessiveSpoilers.alert) {
      const alertMessage = await message.channel.send({
        embeds: [
          new Embed(color)
            .setDescription(
              `Hey ${message.author}, please limit use of spoilers in your messages! Your message has been deleted.`,
            )
            .setFooter({ text: `This message will be deleted in ${config.excessiveSpoilers.deleteAlertAfter} seconds.` }),
        ],
        content: `<@${message.author.id}>`,
      });
      setTimeout(() => {
        if (alertMessage.deletable) alertMessage.delete();
      }, config.excessiveSpoilers.deleteAlertAfter * 1000);
    }

    //* Save action to DB
    const newStrike = new AutomodStrike({
      guildId: message.guildId,
      userId: message.author.id,
      type: 'excessive-spoilers',
      date: new Date(),
    });
    await newStrike.save();

    //* Log the action
    const logChannel = message.guild.channels.cache.get(config.logChannel) as TextChannel;
    if (logChannel && config.logsEnabled) {
      const totalStrikes = await AutomodStrike.countDocuments({ guildId: message.guildId, userId: message.author.id });
      const spoilerStrikes = await AutomodStrike.countDocuments({
        guildId: message.guildId,
        userId: message.author.id,
        type: 'excessive-spoilers',
      });
      logChannel.send({
        embeds: [
          new Embed(color)
            .setAuthor({ name: 'Excessive Spoilers Message Deleted' })
            .setDescription(
              [
                `**User**: ${message.author} (${message.author.username})`,
                `**Channel**: ${message.channel.toString()} (${message.channelId})`,
                `**Total Automod Strikes**: ${totalStrikes}`,
                `**Total Excessive Spoilers Strikes**: ${spoilerStrikes}`,
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
			config.excessiveSpoilers.action,
			config.excessiveSpoilers.duration,
			'Automatically punished after being flagged by automod, sent a message with excessive spoilers.'
		);
  },
};