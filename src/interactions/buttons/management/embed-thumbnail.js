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
const { isValidHttpUrl } = require('@functions/string');

module.exports = {
  name: 'embed-thumbnail',
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-thumbnail-modal')
      .setTitle('Embed Thumbnail')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('thumbnail')
            .setLabel('New thumbnail')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.thumbnail.url ?? '')
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
      if (modal.customId !== 'embed-thumbnail-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(e => {});
      const thumbnail = modal.fields.getTextInputValue('thumbnail');
      if (!thumbnail)
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No thumbnail entered, try again.')],
        });

      if (!isValidHttpUrl(thumbnail))
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No valid thumbnail entered, try again.')],
        });

      if (interaction.message.embeds[1].data.description === '\u200b')
        delete interaction.message.embeds[1].data.description;

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          EmbedBuilder.from(interaction.message.embeds[1]).setThumbnail(thumbnail),
        ],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription(`Set the thumbnail to: \n**${thumbnail}**`.slice(0, 2000))],
      });
    }
  },
};
