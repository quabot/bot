import { Events, Colors, Message, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.MessageDelete,
  name: 'messageDelete',

  async execute({ client }: Omit<EventArgs, 'color'>, message: Message) {
    if (!message.guild?.id) return;
    if (!message.author) return;

    const config = await getLoggingConfig(client, message.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('messageDelete')) return;
    if (config.excludedChannels!.includes(message.channelId)) return;
    if (message.channel.type !== ChannelType.DM) {
      if (message.channel.parentId && config.excludedCategories!.includes(message.channel.parentId)) return;
    }

    const channel = message.guild.channels.cache.get(config.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;
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
