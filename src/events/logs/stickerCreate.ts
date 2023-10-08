const { Client, Events, Sticker, Colors } from'discord.js');
const { getLoggingConfig } from'@configs/loggingConfig');
const { Embed } from'@constants/embed');

module.exports = {
  event: Events.GuildStickerCreate,
  name: 'stickerCreate',
  /**
   * @param {Sticker} sticker
   * @param {Client} client
   */
  async execute(sticker, client) {
    try {
      if (!sticker.guild.id) return;
    } catch (e) {
      // no
    }

    const config = await getLoggingConfig(client, sticker.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events.includes('stickerCreate')) return;

    const channel = sticker.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    await channel.send({
      embeds: [
        new Embed(Colors.Green)
          .setDescription(
            `
                        **Sticker Created**
                        ${sticker.name} - [Full image](${sticker.url})
                        ${sticker.description}
                        `,
          )
          .setFooter({ text: `${sticker.name}`, iconURL: `${sticker.url}` }),
      ],
    });
  },
};
