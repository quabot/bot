import { Events, Sticker, Colors } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildStickerUpdate,
  name: 'stickerUpdate',

  async execute({ client }: EventArgs, oldSticker: Sticker, newSticker: Sticker) {
    if (!newSticker.guild?.id) return;

    const config = await getLoggingConfig(client, newSticker.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    const event = config.events?.find(event => event.event === 'stickerUpdate');
    if (!event) return;

    if (!event.enabled) return;

    const channel = newSticker.guild.channels.cache.get(event.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    let description = '';
    if (oldSticker.name !== newSticker.name)
      description += `\n**Name:** \`${oldSticker.name ?? 'None'}\` -> \`${newSticker.name ?? 'None'}\``;
    if (oldSticker.description !== newSticker.description)
      description += `\n**Description:** \`${oldSticker.description ?? 'None'}\` -> \`${
        newSticker.description ?? 'None'
      }\``;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Yellow)
            .setDescription(
              `
                        **Sticker Edited**
                        ${newSticker.name} - [Full image](${newSticker.url})
                        ${description}
                        `,
            )
            .setFooter({
              text: `${newSticker.name}`,
              iconURL: `${newSticker.url}`,
            }),
        ],
      })
      .catch(() => {});
  },
};
