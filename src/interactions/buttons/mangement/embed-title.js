const {
  Client,
  ButtonInteraction,
  ColorResolvable,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require("discord.js");
const { Embed } = require("@constants/embed");

module.exports = {
  name: "embed-title",
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    const mainModal = new ModalBuilder()
      .setCustomId("embed-title-modal")
      .setTitle("Embed Title")
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("title")
            .setLabel("New title")
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.title ?? "")
            .setRequired(true)
            .setMaxLength(256)
            .setPlaceholder("This is my embed title!"),
        ),
      );

    await interaction.showModal(mainModal);

    const modal = await interaction
      .awaitModalSubmit({
        time: 180000,
        filter: (i) => i.user.id === interaction.user.id,
      })
      .catch((e) => {
        return null;
      });

    if (modal) {
      if (modal.customId !== "embed-title-modal") return;

      await modal.deferReply({ ephemeral: true }).catch((e) => {});
      const title = modal.fields.getTextInputValue("title");
      if (!title)
        return await modal.editReply({
          embeds: [
            new Embed(color).setDescription("No title entered, try again."),
          ],
        });

      if (interaction.message.embeds[1].data.description === "\u200b")
        delete interaction.message.embeds[1].data.description;

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          EmbedBuilder.from(interaction.message.embeds[1]).setTitle(title),
        ],
      });

      await modal.editReply({
        embeds: [
          new Embed(color).setDescription(
            `Set the title to: \n**${title}**`.slice(0, 2000),
          ),
        ],
      });
    }
  },
};
