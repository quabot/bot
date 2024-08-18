import { ColorResolvable, GuildMember, TextChannel, type Message } from 'discord.js';
import { IAutomodConfig } from '@typings/schemas';
import { Embed } from '@constants/embed';
import { Client } from '@classes/discord';
import { profanity } from '@2toad/profanity';
import AutomodStrike from '@schemas/Automod-Strike';
import { actionAutomod } from '@functions/automodUtils';

export const profanityFilter = async (message: Message, config: IAutomodConfig, client: Client, color: ColorResolvable, member: GuildMember) => {
  if (!config.profanityFilter.enabled) return;
  if (!message.guildId) return;
  if (!message.guild) return;

  //* Detect if the message contains profanity
  profanity.addWords(config.profanityFilter.extraWords);
  profanity.removeWords(config.profanityFilter.removedWords);

  if (profanity.exists(message.content)) {
    //* Delete the message
    if (message.deletable) await message.delete().catch(() => null);

    //* Send the alert message (if enabled)
    if (config.alert) {
      const alertMessage = await message.channel.send({
        embeds: [
          new Embed(color)
            .setDescription(`Hey ${message.author}, please do not swear! Your message has been deleted.`)
            .setFooter({ text: `This message will be deleted in ${config.deleteAlertAfter} seconds.` }),
        ],
        content: `<@${message.author.id}>`,
      });
      setTimeout(() => {
        if (alertMessage.deletable) alertMessage.delete();
      }, config.deleteAlertAfter * 1000);
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
    return true;
  }
};
