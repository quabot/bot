import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';
import { checkUserPerms } from '@functions/ticket';
import { hasAnyRole } from '@functions/discord';

export default {
  parent: 'ticket',
  name: 'delete',

  async execute({ client, interaction, color }: CommandArgs) {
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

    const allowed =
      checkUserPerms(ticket, interaction.user, interaction.member) ||
      hasAnyRole(interaction.member, config.staffRoles!);

    if (!allowed)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'You are not allowed to delete the ticket, you need to be added, be the owner, and/or a staff member to delete it.',
          ),
        ],
      });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Delete this ticket with the button below this message.')],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('delete-ticket').setLabel('🗑️ Delete'),
        ),
      ],
    });
  },
};
