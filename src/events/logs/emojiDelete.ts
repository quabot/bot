import { Events, GuildEmoji, Colors } from 'discord.js';
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


    const event = config.events?.find(event => event.event === 'emojiDelete');
    if (!event) return;

    if (!event.enabled) return;

    const channel = emoji.guild.channels.cache.get(event.channelId);
    if (!channel?.isTextBased()) return;
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
