import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';

export default {
  name: 'embed-cancel',

  async execute({ interaction, color }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: true });

    const buttons1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-message')
        .setLabel('Set Message')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-title')
        .setLabel('Set Title')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setDisabled(true).setCustomId('embed-url').setLabel('Set Url').setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-description')
        .setLabel('Set Description')
        .setStyle(ButtonStyle.Primary),
    );

    const buttons2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-thumbnail')
        .setLabel('Set Thumbnail')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-image')
        .setLabel('Set Image')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-footer')
        .setLabel('Set Footer')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-timestamp')
        .setLabel('Add Timestamp')
        .setStyle(ButtonStyle.Primary),
    );

    const buttons3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-color')
        .setLabel('Set Color')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-author')
        .setLabel('Set Author')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-addfield')
        .setLabel('Add Field')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-removefield')
        .setLabel('Remove Field')
        .setStyle(ButtonStyle.Danger),
    );

    const buttons4 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('embed-send')
        .setLabel('Send Message')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder().setDisabled(true).setCustomId('embed-cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger),
    );

    await interaction.message.edit({
      components: [buttons1, buttons2, buttons3, buttons4],
    });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Cancelled!')],
    });
  },
};
