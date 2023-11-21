import { Events, GuildEmoji, Colors, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: Events.GuildEmojiCreate,
  name: 'emojiCreate',

  async execute({ client }: EventArgs, emoji: GuildEmoji) {
    if (!emoji.guild.id) return;

    const config = await getLoggingConfig(client, emoji.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('emojiCreate')) return;

    const channel = emoji.guild.channels.cache.get(config.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Green)
            .setDescription(
              `
                        **${emoji.animated ? 'Animated ' : ''}Emoji Created**
                        ${emoji.name} - [Full image](${emoji.url})
                        `,
            )
            .setFooter({ text: `${emoji.name}`, iconURL: `${emoji.url}` }),
        ],
      })
      .catch(() => {});
  },
};
