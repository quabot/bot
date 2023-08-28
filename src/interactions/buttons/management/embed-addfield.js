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
  name: 'embed-addfield',
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-addfield-modal')
      .setTitle('Embed Add Field')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('title')
            .setLabel('Field Title')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(256)
            .setPlaceholder('I am a field title!    '),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('value')
            .setLabel('Field Value')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(1024)
            .setPlaceholder('I am a field value!'),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('inline')
            .setLabel('Field inline?')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(500)
            .setPlaceholder('true/false'),
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
      if (modal.customId !== 'embed-addfield-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(e => {});
      const title = modal.fields.getTextInputValue('title');
      const value = modal.fields.getTextInputValue('value');
      const inline = modal.fields.getTextInputValue('inline') === 'true';
      if (!title || !value)
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('Not all fields were filled out, try again.')],
        });

      if (interaction.message.embeds[1].data.description === '\u200b')
        delete interaction.message.embeds[1].data.description;

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          EmbedBuilder.from(interaction.message.embeds[1]).addFields({
            name: title,
            value: value,
            inline: inline,
          }),
        ],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription('Added a field!')],
      });
    }
  },
};
