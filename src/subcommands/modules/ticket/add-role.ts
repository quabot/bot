import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';
import { checkUserPerms } from '@functions/ticket';
import {
  ChannelType,
  Role,
  type GuildTextBasedChannel,
  type PrivateThreadChannel,
  type PublicThreadChannel,
} from 'discord.js';

export default {
  parent: 'ticket',
  name: 'add-role',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });
    const role = interaction.options.getRole('role');

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

    if (!role) return;

    const valid = checkUserPerms(ticket, interaction.user, interaction.member);
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to add users to the ticket.')],
      });

    const array = ticket.roles!;
    array.push(role.id);

    await ticket.updateOne({
      roles: array,
    });

    const interChannel = interaction.channel as GuildTextBasedChannel | null;

    if (interChannel?.type === ChannelType.PrivateThread || interChannel?.type === ChannelType.PublicThread)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("This command can't be used in threads.")],
      });

    const channel = interChannel as Exclude<GuildTextBasedChannel, PrivateThreadChannel | PublicThreadChannel>;

    const roleType = role as Role;
    await channel?.permissionOverwrites.edit(roleType, {
      ViewChannel: true,
      SendMessages: true,
    });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`Added ${role} to the ticket.`)],
    });
  },
};
