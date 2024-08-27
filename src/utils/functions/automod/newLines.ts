import { Embed } from '@constants/embed';
import { ColorResolvable, GuildMember, TextChannel, type Message } from 'discord.js';
import AutomodStrike from '@schemas/Automod-Strike';
import { actionAutomod } from '@functions/automodUtils';
import { IAutomodConfig } from '@typings/schemas';
import { Client } from '@classes/discord';

export const newLines = async (
  message: Message,
  config: IAutomodConfig,
  client: Client,
  color: ColorResolvable,
  member: GuildMember,
) => {
  if (message.author.bot) return;
  if (!message.guildId) return;
  if (!message.guild) return;
  if (!config.enabled || !config.newLines.enabled) return;

 //* Detect if the message contains clears more than X lines, must not be just text but by using line-clearing methods. If there is no text between line breaks for up to X lines, blcok it
 const lines = message.content.split('\n');
 if (lines.length < config.newLines.lines) return;
 const clearedLines = lines.filter(line => line.trim() === '');
 if (clearedLines.length < config.newLines.lines) return;

  //* Save action to DB
  const newStrike = new AutomodStrike({
    guildId: message.guildId,
    userId: message.author.id,
    type: 'new-lines',
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
      type: 'new-lines',
    });
    logChannel.send({
      embeds: [
        new Embed(color)
          .setAuthor({ name: 'Chat Clearing Message Deleted' })
          .setDescription(
            [
              `**User**: ${message.author} (${message.author.username})`,
              `**Channel**: ${message.channel.toString()} (${message.channelId})`,
              `**Total Automod Strikes**: ${totalStrikes}`,
              `**Total Chat Clearing Strikes**: ${strikes}`,
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
    config.newLines.action,
    config.newLines.duration,
    'Automatically punished after being flagged by automod, sent a message that tried to clear chat.',
  );

  //* Do the action for the automod rules if configured
  await actionAutomod(
    client,
    member,
    'new-lines',
    config.newLines.duration,
    'Automatically punished after being flagged by automod, sent a message that tried to clear chat',
  );

  return `You have been flagged for sending a chat clearing message. Please avoid posting chat clearing messages in the future.`;
};
