import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';
import { checkUserPerms } from '@functions/ticket';
import {
  ChannelType,
  type GuildTextBasedChannel,
  type PrivateThreadChannel,
  type PublicThreadChannel,
} from 'discord.js';

export default {
  parent: 'ticket',
  name: 'add',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });
    const user = interaction.options.getUser('user');

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

    if (!user) return;

    const valid = checkUserPerms(ticket, interaction.user, interaction.member);
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to add users to the ticket.')],
      });

    const array = ticket.users!;
    array.push(user.id);

    await ticket.updateOne({
      users: array,
    });

    const interChannel = interaction.channel as GuildTextBasedChannel | null;

    if (interChannel?.type === ChannelType.PrivateThread || interChannel?.type === ChannelType.PublicThread)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("This command can't be used in threads.")],
      });

    const channel = interChannel as Exclude<GuildTextBasedChannel, PrivateThreadChannel | PublicThreadChannel>;

    await channel?.permissionOverwrites.edit(user, {
      ViewChannel: true,
      SendMessages: true,
    });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`Added ${user} to the ticket.`)],
    });
  },
};
