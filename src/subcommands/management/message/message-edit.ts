import { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, ChannelType } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'message',
  name: 'edit',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const messageUrl = interaction.options.getString('message', true);
    //! I think I already said it somewhere, but pls put a comment at this thing, cuz I don't fucking understand it
    const ids = messageUrl.match(/\d+/g);
    if (!ids) return;

    const channel = interaction.guild?.channels.cache.get(ids[1]);
    if (!channel || channel.type === ChannelType.GuildCategory)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find any messages with that URL.")],
      });

    const message = (await channel.messages.fetch(ids[2]).catch(() => null)) ?? null;

    if (!message)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find any messages with that URL.")],
      });

    if (message.author.id !== client.user?.id)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('I cannot edit that message.')],
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
    );

    const buttons3 = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder().setCustomId('embed-color').setLabel('Set Color').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-author').setLabel('Set Author').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-addfield').setLabel('Add Field').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed-removefield').setLabel('Remove Field').setStyle(ButtonStyle.Danger),
    );

    const buttons4 = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder().setCustomId('embed-save').setLabel('Save Message').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('embed-cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger),
    );

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `Click the buttons below this message to set components of the embed.\nIf the description is empty the embed will not be sent. Message URL: ${messageUrl}`,
        ),
        EmbedBuilder.from(message.embeds[0]) || new EmbedBuilder().setDescription('\u200b').setColor(color),
      ],
      components: [buttons1, buttons2, buttons3, buttons4],
      content: message.content,
    });
  },
};
