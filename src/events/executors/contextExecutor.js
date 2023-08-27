const { Client, Interaction, Colors, ChannelType } = require("discord.js");
const { getServerConfig } = require("@configs/serverConfig");
const { handleError } = require("@constants/errorHandler");

module.exports = {
  event: "interactionCreate",
  name: "buttonExecutor",
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (
      interaction.channel.type === ChannelType.DM ||
      interaction.channel.type === ChannelType.GroupDM
    )
      return;
    if (!interaction.isUserContextMenuCommand() || !interaction.guildId) return;

    const context = client.contexts.get(interaction.commandName);
    if (!context) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? "#416683";

    context
      .execute(client, interaction, color)
      .catch((e) => handleError(client, e, interaction.customId));
  },
};
