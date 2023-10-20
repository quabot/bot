import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';
import { checkUserPerms } from '@functions/ticket';

export default {
  parent: 'ticket',
  name: 'close',

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

    if (ticket.closed)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This ticket is already closed.')],
      });

    const valid = checkUserPerms(ticket, interaction.user, interaction.member);
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to close the ticket.')],
      });

    const closedCategory = interaction.guild?.channels.cache.get(config.closedCategory);
    if (!closedCategory)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'There is no category to move this ticket to once closed. Configure this on our [dashboard](https://quabot.net/dashboard).',
          ),
        ],
      });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Close this ticket with the button below this message.')],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('close-ticket').setLabel('🔒 Close'),
        ),
      ],
    });
  },
};
