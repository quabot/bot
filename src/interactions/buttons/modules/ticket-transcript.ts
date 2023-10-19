import Ticket from '@schemas/Ticket';
import { getIdConfig } from '@configs/idConfig';
import { getTicketConfig } from '@configs/ticketConfig';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import discordTranscripts from 'discord-html-transcripts';
import { checkUserPerms } from '@functions/ticket';

export default {
  name: 'transcript-ticket',

  async execute({ client, interaction, color }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getTicketConfig(client, interaction.guildId!);
    const ids = await getIdConfig(interaction.guildId!, client);

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
        embeds: [new Embed(color).setDescription('You are not allowed to request a transcript of this ticket.')],
      });

    const attachment = await discordTranscripts.createTranscript(interaction.channel!, {
      limit: -1,
      saveImages: false,
    });

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('Ticket Transcript')
          .setDescription('The transcript is in the attachment. Open it in the browser to view it.'),
      ],
      files: [attachment],
    });
  },
};
