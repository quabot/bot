const { Client, Events, GuildEmoji, Colors } = require('discord.js');
const { getLoggingConfig } = require('@configs/loggingConfig');
const { Embed } = require('@constants/embed');

module.exports = {
  event: Events.GuildEmojiDelete,
  name: 'emojiDelete',
  /**
   * @param {GuildEmoji} emoji
   * @param {Client} client
   */
  async execute(emoji, client) {
    if (!emoji.guild.id) return;

    const config = await getLoggingConfig(client, emoji.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events.includes('emojiDelete')) return;

    const channel = emoji.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    await channel.send({
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
    });
  },
};
