import { Events, Sticker, Colors } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildStickerDelete,
  name: 'stickerDelete',

  async execute({ client }: EventArgs, sticker: Sticker) {
    if (!sticker.guild?.id) return;

    const config = await getLoggingConfig(client, sticker.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('stickerDelete')) return;

    const channel = sticker.guild.channels.cache.get(config.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Red)
            .setDescription(
              `
                        **Sticker Deleted**
                        ${sticker.name} - [Full image](${sticker.url})
                        ${sticker.description}
                        `,
            )
            .setFooter({ text: `${sticker.name}`, iconURL: `${sticker.url}` }),
        ],
      })
      .catch(() => {});
  },
};
