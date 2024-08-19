import { Events, Colors, Message } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';
import { getAutomodConfig } from '@configs/automodConfig';
import { regexPreCheck } from '@functions/automod/regexPreCheck';

export default {
  event: Events.MessageDelete,
  name: 'messageDelete',

  async execute({ client }: Omit<EventArgs, 'color'>, message: Message) {
    if (!message.guild?.id) return;
    if (!message.author) return;

    const config = await getLoggingConfig(client, message.guild.id);
    if (!config) return;
    if (!config.enabled) return;
    if (!config.logBotActions && message.author.bot) return;

    const event = config.events?.find(event => event.event === 'messageDelete');
    if (!event) return;

    if (!event.enabled) return;
    if (config.excludedChannels!.includes(message.channelId)) return;
    if (!message.channel.isDMBased()) {
      if (message.channel.parentId && config.excludedCategories!.includes(message.channel.parentId)) return;
    }

    const automodConfig = await getAutomodConfig(message.guild.id, client);
    if (!automodConfig) return;
    if (automodConfig.enabled && !(await regexPreCheck(message, automodConfig))) return;

    const channel = message.guild.channels.cache.get(event.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    let description = '';
    if (message.content)
      description +=
        message.content.length > 1002 ? `${message.content.slice(0, 999)}...` : message.content.slice(0, 1002);

    if (message.author.bot) return;

    const embed = new Embed(Colors.Red)
      .setDescription(
        `
            **Message Deleted**
            ${description}
            `,
      )
      .addFields({ name: 'Channel', value: `${message.channel}`, inline: true })
      .setFooter({
        text: `User: @${message.author.username ?? 'none'}`,
        iconURL: message.author.displayAvatarURL({ forceStatic: false }),
      });

    const attachments = message.attachments.map(i => i.url);
    if (attachments.length !== 0)
      embed.addFields({
        name: '**Attachments**',
        value: `${attachments.join('\n')}`.slice(0, 1024),
      });

    await channel
      .send({
        embeds: [embed],
      })
      .catch(() => {});
  },
};
