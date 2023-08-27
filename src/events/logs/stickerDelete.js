const { Client, Events, Sticker, Colors } = require('discord.js');
const { getLoggingConfig } = require('@configs/loggingConfig');
const { Embed } = require('@constants/embed');

module.exports = {
  event: Events.GuildStickerDelete,
  name: 'stickerDelete',
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

    if (!config.events.includes('stickerDelete')) return;

    const channel = sticker.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    await channel.send({
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
    });
  },
};
