import { Embed } from '@constants/embed';
import { ColorResolvable, GuildMember, TextChannel, type Message } from 'discord.js';
import AutomodStrike from '@schemas/Automod-Strike';
import { actionAutomod } from '@functions/automodUtils';
import { IAutomodConfig } from '@typings/schemas';
import { Client } from '@classes/discord';

export const excessiveCaps = async (
  message: Message,
  config: IAutomodConfig,
  client: Client,
  color: ColorResolvable,
  member: GuildMember,
) => {
  if (message.author.bot) return;
  if (!message.guildId) return;
  if (!message.guild) return;
  if (!config.enabled || !config.excessiveCaps.enabled) return;

  //* Detect if the message contains more that percentage caps
  const capsRegex = /[A-Z]/g;
  const caps = message.content.match(capsRegex);
  if (!caps) return;
  const percentage = (caps.length / message.content.length) * 100;
  if (percentage < config.excessiveCaps.percentage) return;

  //* Save action to DB
  const newStrike = new AutomodStrike({
    guildId: message.guildId,
    userId: message.author.id,
    type: 'excessive-caps',
    date: new Date().getTime(),
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
    'Automatically punished after being flagged by automod, sent a message with excessive caps.',
  );

  //* Do the action for the automod rules if configured
  await actionAutomod(
    client,
    member,
    'excessive-caps',
    config.excessiveCaps.duration,
    'Automatically punished after being flagged by automod, sent a message with excessive caps.',
  );

  return `You have been flagged for excessive caps in your message. Please avoid using excessive caps in the future.`;
};
