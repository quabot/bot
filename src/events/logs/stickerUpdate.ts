const { Client, Events, Sticker, Colors } from'discord.js');
const { getLoggingConfig } from'@configs/loggingConfig');
const { Embed } from'@constants/embed');

export default {
  event: Events.GuildStickerUpdate,
  name: 'stickerUpdate',
  /**
   * @param {Sticker} oldSticker
   * @param {Sticker} newSticker
   * @param {Client} client
   */
  async execute(oldSticker, newSticker, client) {
    try {
      if (!newSticker.guild.id) return;
    } catch (e) {
      // no
    }

    const config = await getLoggingConfig(client, newSticker.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events.includes('stickerUpdate')) return;

    const channel = newSticker.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    let description = '';
    if (oldSticker.name !== newSticker.name)
      description += `\n**Name:** \`${oldSticker.name ?? 'None'}\` -> \`${newSticker.name ?? 'None'}\``;
    if (oldSticker.description !== newSticker.description)
      description += `\n**Description:** \`${oldSticker.description ?? 'None'}\` -> \`${
        newSticker.description ?? 'None'
      }\``;

    await channel.send({
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
    });
  },
};
