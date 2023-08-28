const {
  Client,
  ButtonInteraction,
  ColorResolvable,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require('discord.js');
const { Embed } = require('@constants/embed');
const { isValidHttpUrl } = require('@functions/string');

module.exports = {
  name: 'delete-punishment',
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    const id = interaction.message.embeds[0].footer.text;
    if (!id)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription('An internal error occurred: no punishment ID in embed footer found.'),
        ],
        ephemeral: true,
      });

    const Punishment = require('@schemas/Punishment');
    const punishment = await Punishment.findOne({
      guildId: interaction.guildId,
      id,
    });
    if (!punishment)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('An internal error occurred: no punishment found for the ID.')],
        ephemeral: true,
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel('Delete')
        .setEmoji('🗑️')
        .setDisabled(true)
        .setCustomId('delete-punishment'),
    );

    await interaction.update({
      components: [row],
    });

    await interaction.followUp({
      embeds: [new Embed(color).setDescription('Punishment deleted.')],
      ephemeral: true,
    });

    await Punishment.deleteOne({ guildId: interaction.guildId, id });
  },
};
