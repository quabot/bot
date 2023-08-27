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
  name: "embed-removefield",
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    const mainModal = new ModalBuilder()
      .setCustomId("embed-removefield-modal")
      .setTitle("Remove Embed Field")
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("index")
            .setLabel("Field to remove")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(2)
            .setPlaceholder("1"),
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
      if (modal.customId !== "embed-removefield-modal") return;

      await modal.deferReply({ ephemeral: true }).catch((e) => {});
      const index = parseInt(modal.fields.getTextInputValue("index"));
      if (!index)
        return await modal.editReply({
          embeds: [
            new Embed(color).setDescription("No index entered, try again."),
          ],
        });

      const indexSplice = interaction.message.embeds[1].data.fields
        ? index - 1
        : 0;

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          EmbedBuilder.from(interaction.message.embeds[1]).spliceFields(
            indexSplice,
            1,
          ),
        ],
      });

      await modal.editReply({
        embeds: [
          new Embed(color).setDescription("Field deleted".slice(0, 2000)),
        ],
      });
    }
  },
};
