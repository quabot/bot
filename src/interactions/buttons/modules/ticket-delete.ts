import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Ticket from '@schemas/Ticket';
import { getIdConfig } from '@configs/idConfig';
import { getTicketConfig } from '@configs/ticketConfig';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import { checkUserPerms } from '@functions/ticket';

export default {
  name: 'delete-ticket',

  async execute({ client, interaction, color }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getTicketConfig(client, interaction.guildId!);
    const ids = await getIdConfig(interaction.guildId!);

    if (!config || !ids)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Tickets are disabled in this server.')],
      });

    const ticket = await Ticket.findOne({
      channelId: interaction.channelId,
    });
    if (!ticket)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This is not a valid ticket.')],
      });

    if (!ticket.closed)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This ticket is not closed.')],
      });

    const valid = checkUserPerms(ticket, interaction.user, interaction.member);
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to delete the ticket.')],
      });

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('Are you sure you want to delete the ticket?')
          .setDescription("This cannot be undone. Click 'Confirm' to delete it."),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .setComponents(
            new ButtonBuilder().setCustomId('cancel-delete-ticket').setLabel('❌ Cancel').setStyle(ButtonStyle.Danger),
          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId('confirm-delete-ticket')
              .setLabel('✅ Confirm')
              .setStyle(ButtonStyle.Success),
          ),
      ],
    });
  },
};
