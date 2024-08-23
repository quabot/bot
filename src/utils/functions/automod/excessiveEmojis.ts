import { Embed } from '@constants/embed';
import { ColorResolvable, GuildMember, TextChannel, type Message } from 'discord.js';
import AutomodStrike from '@schemas/Automod-Strike';
import { actionAutomod } from '@functions/automodUtils';
import { IAutomodConfig } from '@typings/schemas';
import { Client } from '@classes/discord';

export const excessiveEmojis = async (
  message: Message,
  config: IAutomodConfig,
  client: Client,
  color: ColorResolvable,
  member: GuildMember,
) => {
  if (message.author.bot) return;
  if (!message.guildId) return;
  if (!message.guild) return;
  if (!config.enabled || !config.excessiveEmojis.enabled) return;

  //* Detect if the message contains more that percentage emojis (check regular emojis and custom emojis)
  const customEmojiRegex = /<a?:[a-zA-Z0-9_]+:[0-9]+>/g;
  const customEmojis = message.content.match(customEmojiRegex);
  let newContent = message.content.replace(customEmojiRegex, '.');

  const emojiRegex =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  const emojis = message.content.match(emojiRegex);
  newContent = newContent.replace(emojiRegex, '.');
  if (!emojis && !customEmojis) return;

  const totalEmojis = (emojis?.length ?? 0) + (customEmojis?.length ?? 0);
  const percentage = (totalEmojis / newContent.length) * 100;
  if (percentage < config.excessiveEmojis.percentage) return;

  //* Save action to DB
  const newStrike = new AutomodStrike({
    guildId: message.guildId,
    userId: message.author.id,
    type: 'excessive-emojis',
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
      type: 'excessive-emojis',
    });
    logChannel.send({
      embeds: [
        new Embed(color)
          .setAuthor({ name: 'Message With Excessive Emojis Deleted' })
          .setDescription(
            [
              `**User**: ${message.author} (${message.author.username})`,
              `**Channel**: ${message.channel.toString()} (${message.channelId})`,
              `**Total Automod Strikes**: ${totalStrikes}`,
              `**Total Excessive Emojis Strikes**: ${strikes}`,
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
    config.excessiveEmojis.action,
    config.excessiveEmojis.duration,
    'Automatically punished after being flagged by automod, sent a message with excessive emojis.',
  );

  return `You have been flagged for using too many emojis in your message. Please avoid using excessive emojis in the future.`;
};
