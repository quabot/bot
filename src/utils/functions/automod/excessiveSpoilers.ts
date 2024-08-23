import { Embed } from '@constants/embed';
import { ColorResolvable, GuildMember, TextChannel, type Message } from 'discord.js';
import AutomodStrike from '@schemas/Automod-Strike';
import { actionAutomod } from '@functions/automodUtils';
import { IAutomodConfig } from '@typings/schemas';
import { Client } from '@classes/discord';

export const excessiveSpoilers = async (
  message: Message,
  config: IAutomodConfig,
  client: Client,
  color: ColorResolvable,
  member: GuildMember,
) => {
  if (message.author.bot) return;
  if (!message.guildId) return;
  if (!message.guild) return;
  if (!config.enabled || !config.excessiveSpoilers.enabled) return;

  //* Detect what percentage of the message is a spoiler (between || on both sides), if below max return. Spoilers should include the text between them
  const spoilerRegex = /\|\|.*?\|\|/g;
  const spoilers = message.content.match(spoilerRegex);
  if (!spoilers) return;
  const spoilerLength = spoilers.reduce((acc, spoiler) => acc + spoiler.length, 0);
  const percentage = (spoilerLength / message.content.length) * 100;
  if (percentage < config.excessiveSpoilers.percentage) return;


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
    const strikes = await AutomodStrike.countDocuments({
      guildId: message.guildId,
      userId: message.author.id,
      type: 'excessive-spoilers',
    });
    logChannel.send({
      embeds: [
        new Embed(color)
          .setAuthor({ name: 'Message With Excessive Spoilers Deleted' })
          .setDescription(
            [
              `**User**: ${message.author} (${message.author.username})`,
              `**Channel**: ${message.channel.toString()} (${message.channelId})`,
              `**Total Automod Strikes**: ${totalStrikes}`,
              `**Total Excessive Spoilers Strikes**: ${strikes}`,
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
    'Automatically punished after being flagged by automod, sent a message with excessive spoilers.',
  );

  return `You have been flagged for having too much content be a spoiler in your message. Please avoid using excessive spoilers in the future.`;
};
