import { Events, GuildEmoji, Colors, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildEmojiDelete,
  name: 'emojiDelete',

  async execute({ client }: EventArgs, emoji: GuildEmoji) {
    if (!emoji.guild.id) return;

    const config = await getLoggingConfig(client, emoji.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('emojiDelete')) return;

    const channel = emoji.guild.channels.cache.get(config.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;
    if (!hasSendPerms(channel)) return;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Red)
            .setDescription(
              `
                        **${emoji.animated ? 'Animated ' : ''}Emoji Deleted**
                        ${emoji.name} - [Full image](${emoji.url})
                        `,
            )
            .setFooter({ text: `${emoji.name}`, iconURL: `${emoji.url}` }),
        ],
      })
      .catch(() => {});
  },
};
