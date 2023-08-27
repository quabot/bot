const {
  ChatInputCommandInteraction,
  Client,
  ColorResolvable,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { getAfkConfig } = require("@configs/afkConfig");
const { getUser } = require("@configs/user");
const { Embed } = require("@constants/embed");

module.exports = {
  parent: "afk",
  name: "status",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
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

    const modal = new ModalBuilder()
      .setCustomId("afk-set")
      .setTitle("Set AFK status");

    const afkRow = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("afk-status")
        .setLabel("Enter your new AFK status")
        .setMinLength(1)
        .setMaxLength(200)
        .setPlaceholder("I'm sleeping...")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph),
    );
    modal.addComponents(afkRow);

    await interaction.showModal(modal);
  },
};
