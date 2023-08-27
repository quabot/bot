const { Client, ModalSubmitInteraction } = require("discord.js");
const { Embed } = require("@constants/embed");
const { getAfkConfig } = require("@configs/afkConfig");
const { getUser } = require("@configs/user");

module.exports = {
  name: "afk-set",
  /**
   * @param {Client} client
   * @param {ModalSubmitInteraction} interaction
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getAfkConfig(interaction.guildId, client);
    const user = await getUser(interaction.guildId, interaction.user.id);
    if (!config || !user)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use! Please run the command again.",
          ),
        ],
        ephemeral: true,
      });

    if (!config.enabled)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            "The afk module is disabled in this server.",
          ),
        ],
        ephemeral: true,
      });

    const status = interaction.fields.getTextInputValue("afk-status");
    user.afkMessage = status;
    await user.save();

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `Set your AFK status message to: \`${status}\``,
        ),
      ],
    });
  },
};
