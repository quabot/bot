import { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { channelBlacklist } from '@constants/discord';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'message',
  name: 'send',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const channel = interaction.options.getChannel('channel', true);
    if (channelBlacklist.includes(channel.type))
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter a valid channel type.')],
      });

    const buttons1 = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder().setCustomId('embed-message').setLabel('Set Message').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-title').setLabel('Set Title').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-url').setLabel('Set Url').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-description').setLabel('Set Description').setStyle(ButtonStyle.Primary),
    );

    const buttons2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder().setCustomId('embed-thumbnail').setLabel('Set Thumbnail').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-image').setLabel('Set Image').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-footer').setLabel('Set Footer').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-timestamp').setLabel('Add Timestamp').setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('embed-removetimestamp')
        .setLabel('Remove Timestamp')
        .setStyle(ButtonStyle.Danger),
    );

    const buttons3 = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder().setCustomId('embed-color').setLabel('Set Color').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-author').setLabel('Set Author').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-addfield').setLabel('Add Field').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-removefield').setLabel('Remove Field').setStyle(ButtonStyle.Danger),
    );

    const buttons4 = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder().setCustomId('embed-send').setLabel('Send Message').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('embed-cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger),
    );

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `Click the buttons below this message to set components of the embed.\nThe message will be sent to ${channel}. If the embed is empty it will not be sent.`,
        ),
        new EmbedBuilder().setDescription('\u200b').setColor(color),
      ],
      components: [buttons1, buttons2, buttons3, buttons4],
    });
  },
};
