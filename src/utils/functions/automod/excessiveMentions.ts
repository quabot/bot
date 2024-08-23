import { Embed } from '@constants/embed';
import { ColorResolvable, GuildMember, TextChannel, type Message } from 'discord.js';
import AutomodStrike from '@schemas/Automod-Strike';
import { actionAutomod } from '@functions/automodUtils';
import { IAutomodConfig } from '@typings/schemas';
import { Client } from '@classes/discord';

export const excessiveMentions = async (
  message: Message,
  config: IAutomodConfig,
  client: Client,
  color: ColorResolvable,
  member: GuildMember,
) => {
  if (message.author.bot) return;
  if (!message.guildId) return;
  if (!message.guild) return;
  if (!config.enabled || !config.excessiveMentions.enabled) return;

  //* Detect if the message contains more than max mentions amount of mentions
  const mentionsRegex = /<@&[0-9]+>|<@![0-9]+>|<@[0-9]+>|<#[0-9]+>/g;
  const mentions = message.content.match(mentionsRegex)?.length ?? 0;
  if (mentions < config.excessiveMentions.mentions) return;


  //* Save action to DB
  const newStrike = new AutomodStrike({
    guildId: message.guildId,
    userId: message.author.id,
    type: 'excessive-mentions',
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
      type: 'excessive-mentions',
    });
    logChannel.send({
      embeds: [
        new Embed(color)
          .setAuthor({ name: 'Message With Excessive Mentions Deleted' })
          .setDescription(
            [
              `**User**: ${message.author} (${message.author.username})`,
              `**Channel**: ${message.channel.toString()} (${message.channelId})`,
              `**Total Automod Strikes**: ${totalStrikes}`,
              `**Total Excessive Mentions Strikes**: ${strikes}`,
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
    config.excessiveMentions.action,
    config.excessiveMentions.duration,
    'Automatically punished after being flagged by automod, sent a message with excessive mentions.',
  );

  return `You have been flagged for tagging too many roles, users and channels in your message. Please avoid using excessive mentions in the future.`;
};
