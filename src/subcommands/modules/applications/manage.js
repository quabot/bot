const {
  ChatInputCommandInteraction,
  Client,
  ColorResolvable,
} = require("discord.js");
const { Embed } = require("@constants/embed");
const { getApplicationConfig } = require("@configs/applicationConfig");

module.exports = {
  parent: "applications",
  name: "help",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getApplicationConfig(interaction.guildId, client);
    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use! Please run the command again.",
          ),
        ],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "This module is disabled in this server.",
          ),
        ],
      });

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `In order to manage applications, please go to our [dashboard](https://quabot.net/dashboard/${interaction.guildId}/modules/applications).`,
        ),
      ],
    });
  },
};
