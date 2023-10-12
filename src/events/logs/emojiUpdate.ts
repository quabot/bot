const { Client, Events, GuildEmoji, Colors } from'discord.js');
const { getLoggingConfig } from'@configs/loggingConfig');
const { Embed } from'@constants/embed');

export default {
  event: Events.GuildEmojiUpdate,
  name: 'emojiUpdate',
  /**
   * @param {GuildEmoji} oldEmoji
   * @param {GuildEmoji} newEmoji
   * @param {Client} client
   */
  async execute(oldEmoji, newEmoji, client) {
    if (!newEmoji.guild.id) return;

    const config = await getLoggingConfig(client, oldEmoji.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events.includes('emojiUpdate')) return;

    const channel = oldEmoji.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    await channel.send({
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
    });
  },
};
