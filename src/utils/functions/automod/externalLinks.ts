import { Embed } from '@constants/embed';
import { ColorResolvable, GuildMember, TextChannel, type Message } from 'discord.js';
import AutomodStrike from '@schemas/Automod-Strike';
import { actionAutomod } from '@functions/automodUtils';
import { IAutomodConfig } from '@typings/schemas';
import { Client } from '@classes/discord';

export const externalLinks = async (
  message: Message,
  config: IAutomodConfig,
  client: Client,
  color: ColorResolvable,
  member: GuildMember,
) => {
  if (message.author.bot) return;
  if (!message.guildId) return;
  if (!message.guild) return;
  if (!config.enabled || !config.externalLinks.enabled) return;

  //* Detect if the message contains an external link (not discord)
  const externalLinkRegex = /https?:\/\/(?!discord)([^\s]+)/gi;
  const externalLinks = message.content.match(externalLinkRegex);
  if (!externalLinks) return;

  //* Save action to DB
  const newStrike = new AutomodStrike({
    guildId: message.guildId,
    userId: message.author.id,
    type: 'external-link',
    date: new Date().getTime(),
  });
  await newStrike.save();

  //* Log the action
  const logChannel = message.guild.channels.cache.get(config.logChannel) as TextChannel;
  if (logChannel && config.logsEnabled) {
    const totalStrikes = await AutomodStrike.countDocuments({ guildId: message.guildId, userId: message.author.id });
    const strikes = await AutomodStrike.countDocuments({
      guildId: message.guildId,
      userId: message.author.id,
      type: 'external-links',
    });
    logChannel.send({
      embeds: [
        new Embed(color)
          .setAuthor({ name: 'Message With External Link(s) Deleted' })
          .setDescription(
            [
              `**User**: ${message.author} (${message.author.username})`,
              `**Channel**: ${message.channel.toString()} (${message.channelId})`,
              `**Total Automod Strikes**: ${totalStrikes}`,
              `**Total Excessive Links Strikes**: ${strikes}`,
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
    config.externalLinks.action,
    config.externalLinks.duration,
    'Automatically punished after being flagged by automod, sent a message with external links.',
  );

  //* Do the action for the automod rules if configured
  await actionAutomod(
    client,
    member,
    'external-links',
    config.externalLinks.duration,
    'Automatically punished after being flagged by automod, sent a message with external links.',
  );

  return `You have been flagged for sending an external link. Please avoid posting external links in the future.`;
};
