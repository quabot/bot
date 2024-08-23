import { Events, GuildEmoji, Colors } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildEmojiUpdate,
  name: 'emojiUpdate',

  async execute({ client }: EventArgs, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
    if (!newEmoji.guild.id) return;

    const config = await getLoggingConfig(client, oldEmoji.guild.id);
    if (!config) return;
    if (!config.enabled) return;


    const event = config.events?.find(event => event.event === 'emoijUpdate');
    if (!event) return;

    if (!event.enabled) return;

    const channel = oldEmoji.guild.channels.cache.get(event.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Yellow)
            .setDescription(
              `
                        **${newEmoji.animated ? 'Animated ' : ''}Emoji Edited**
                        ${oldEmoji.name} -> ${newEmoji.name} - [Full image](${newEmoji.url})
                        `,
            )
            .setFooter({ text: `${newEmoji.name}`, iconURL: `${newEmoji.url}` }),
        ],
      })
      .catch(() => {});
  },
};
