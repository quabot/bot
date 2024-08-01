import { Events, Colors, Message } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.MessageUpdate,
  name: 'messageUpdate',

  async execute({ client }: EventArgs, oldMessage: Message, newMessage: Message) {
    if (!newMessage.guild?.id) return;

    const config = await getLoggingConfig(client, newMessage.guild.id);
    if (!config) return;
    if (!config.enabled) return;
    if (!config.logBotActions && newMessage.author.bot) return;

    const event = config.events?.find(event => event.event === 'messageUpdate');
    if (!event) return;

    if (!event.enabled) return;
    if (config.excludedChannels!.includes(newMessage.channelId)) return;
    if (!newMessage.channel.isDMBased()) {
      if (newMessage.channel.parentId && config.excludedCategories!.includes(newMessage.channel.parentId)) return;
    }

    const channel = newMessage.guild.channels.cache.get(event.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    if (!oldMessage.author || oldMessage.author.bot) return;

    const embed = new Embed(Colors.Yellow).setDescription(`**Message Edited**
            ${newMessage.channel} - [Jump to Message](${newMessage.url})`);

    if (
      (!oldMessage.content || oldMessage.content === '') &&
      oldMessage.attachments === null &&
      newMessage.attachments === null
    )
      return;
    if (oldMessage.content !== newMessage.content) {
      if (oldMessage.content) embed.addFields({ name: 'Old Content', value: `${oldMessage.content}`.slice(0, 1020) });
      if (newMessage.content) embed.addFields({ name: 'New Content', value: `${newMessage.content}`.slice(0, 1020) });
    }

    if (newMessage.author)
      embed.setFooter({
        text: `@${newMessage.author.username}`,
        iconURL: `${newMessage.author.avatarURL({ forceStatic: false }) ?? 'https://i.imgur.com/VUwD8zP.png'}`,
      });

    const oldAttachments = oldMessage.attachments.map(i => i.url);
    const newAttachments = newMessage.attachments.map(i => i.url);

    if (oldAttachments.length > newAttachments.length) {
      if (oldAttachments.length > 0) {
        embed.addFields({
          name: '**Old Attachments**',
          value: `${oldAttachments.join('\n')}`.slice(0, 1024),
        });
      }

      if (newAttachments.length > 0) {
        embed.addFields({
          name: '**New Attachments**',
          value: `${newAttachments.join('\n')}`.slice(0, 1024),
        });
      }
    }

    await channel
      .send({
        embeds: [embed],
      })
      .catch(() => {});
  },
};
