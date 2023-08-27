const { Client, Events, GuildEmoji, Colors } = require("discord.js");
const { getLoggingConfig } = require("@configs/loggingConfig");
const { Embed } = require("@constants/embed");

module.exports = {
  event: Events.GuildEmojiCreate,
  name: "emojiCreate",
  /**
   * @param {GuildEmoji} emoji
   * @param {Client} client
   */
  async execute(emoji, client) {
    if (!emoji.guild.id) return;

    const config = await getLoggingConfig(client, emoji.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events.includes("emojiCreate")) return;

    const channel = emoji.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    await channel.send({
      embeds: [
        new Embed(Colors.Green)
          .setDescription(
            `
                        **${emoji.animated ? "Animated " : ""}Emoji Created**
                        ${emoji.name} - [Full image](${emoji.url})
                        `,
          )
          .setFooter({ text: `${emoji.name}`, iconURL: `${emoji.url}` }),
      ],
    });
  },
};
