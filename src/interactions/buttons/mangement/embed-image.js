const {
  Client,
  ButtonInteraction,
  ColorResolvable,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require('discord.js');
const { Embed } = require('@constants/embed');
const { isValidHttpUrl } = require('../../../utils/functions/string');

module.exports = {
  name: 'embed-image',
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-image-modal')
      .setTitle('Embed Image')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('image')
            .setLabel('New image')
            .setValue(interaction.message.embeds[1].data.image.url ?? '')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(500)
            .setPlaceholder('Insert your awesome hippo photo url here...'),
        ),
      );

    await interaction.showModal(mainModal);

    const modal = await interaction
      .awaitModalSubmit({
        time: 180000,
        filter: i => i.user.id === interaction.user.id,
      })
      .catch(e => {
        return null;
      });

    if (modal) {
      if (modal.customId !== 'embed-image-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(e => {});
      const image = modal.fields.getTextInputValue('image');
      if (!image)
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No image entered, try again.')],
        });

      if (!isValidHttpUrl(image))
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No valid image entered, try again.')],
        });

      if (interaction.message.embeds[1].data.description === '\u200b')
        delete interaction.message.embeds[1].data.description;

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          EmbedBuilder.from(interaction.message.embeds[1]).setImage(image),
        ],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription(`Set the image to: \n**${image}**`.slice(0, 2000))],
      });
    }
  },
};
