import { ColorResolvable, TextChannel, type Message } from 'discord.js';
import { IAutomodConfig } from '@typings/schemas';
import { Embed } from '@constants/embed';
import { Client } from '@classes/discord';
import AutomodStrike from '@schemas/Automod-Strike';
import { actionAutomod } from '@functions/automodUtils';

export const customRegex = async (
  message: Message,
  config: IAutomodConfig,
  client: Client,
  color: ColorResolvable,
  member: any,
  regex: any,
) => {
  if (!message.guildId) return;
  if (!message.guild) return;
  if (!regex.enabled) return;

  //* Handle the chat cooldown
  const regexParse = new RegExp(regex.regex, 'g');
  const regexMatch = message.content.match(regexParse);
  if (!regexMatch) return;

  if (regexMatch.length < regex.matchAmount) return;

  //* Save action to DB
  const newStrike = new AutomodStrike({
    guildId: message.guildId,
    userId: message.author.id,
    type: 'custom-regex',
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
      type: 'custom-regex',
    });
    
    logChannel.send({
      embeds: [
        new Embed(color)
          .setAuthor({ name: `Message Flagged By ${regex.name}` })
          .setDescription(
            [
              `**User**: ${message.author} (${message.author.username})`,
              `**Channel**: ${message.channel.toString()} (${message.channelId})`,
              `**Total Automod Strikes**: ${totalStrikes}`,
              `**Total Custom Regex Strikes**: ${strikes}`,
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

  return `You have been flagged by ${regex.name}.`;
};
