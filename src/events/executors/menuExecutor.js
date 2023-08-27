const { Client, Interaction, Colors } = require("discord.js");
const { getServerConfig } = require("@configs/serverConfig");
const { handleError } = require("@constants/errorHandler");

module.exports = {
  event: "interactionCreate",
  name: "menuExecutor",
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isStringSelectMenu() || !interaction.guildId) return;

    const menu = client.menus.get(interaction.customId);
    if (!menu) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? "#416683";

    menu
      .execute(client, interaction, color)
      .catch((e) => handleError(client, e, interaction.customId));
  },
};
