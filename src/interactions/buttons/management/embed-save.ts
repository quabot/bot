//! Idk what this file even does, pls add comments in this thing or write better code
//@ts-nocheck
import { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';

export default {
  name: 'embed-save',

  async execute({ interaction, color }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: true });

    const msg = interaction.message.embeds[0].data.description;
    const url = msg.match(/\b((https?|ftp|file):\/\/|(www|ftp)\.)[-A-Z0-9+&@#%?=~_|$!:,.;]*[A-Z0-9+&@#%=~_|$]/gi);

    const ids = url.match(/\d+/g);
    const message =
      (await interaction.guild.channels.cache
        .get(ids[1])
        ?.messages.fetch(ids[2])
        .catch(err => null)) ?? null;

    if (!message)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find any messages with that URL.")],
      });

    const embed = EmbedBuilder.from(interaction.message.embeds[1]);
    if (embed.data.description === '\u200b') await message.edit({ content: interaction.message.content });
    if (embed.data.description !== '\u200b')
      await message.edit({
        content: interaction.message.content,
        embeds: [embed],
      });

    const buttons1 = new ActionRowBuilder<ButtonBuilder>().setComponents(
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

    const buttons2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
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

    const buttons3 = new ActionRowBuilder<ButtonBuilder>().setComponents(
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

    const buttons4 = new ActionRowBuilder<ButtonBuilder>().setComponents(
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

    interaction.editReply({
      embeds: [new Embed(color).setDescription('Message has been sent!')],
    });
  },
};
