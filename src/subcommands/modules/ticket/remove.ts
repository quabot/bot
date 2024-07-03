import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';
import { checkUserPerms } from '@functions/ticket';
import { ChannelType, GuildTextBasedChannel, type PrivateThreadChannel, type PublicThreadChannel } from 'discord.js';
import { hasSendPerms } from '@functions/discord';

export default {
  parent: 'ticket',
  name: 'remove',

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
    if (!array.includes(user.id))
      return await interaction
        .editReply({
          embeds: [new Embed(color).setDescription("That user isn't in this ticket!")],
        })
        .catch(() => {});

    for (var i = 0; i < array.length; i++) {
      if (array[i] === `${user.id}`) {
        array.splice(i, 1);
        i--;
      }
    }

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
      ViewChannel: false,
      SendMessages: false,
    });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`Removed ${user} from the ticket.`)],
    });

    if (config.dmEnabled && config.dmEvents.includes('remove')) {
      const ticketOwner = await interaction.guild?.members.fetch(ticket.owner).catch(() => null);

      if (ticketOwner) {
        const dmChannel = await ticketOwner.user.createDM().catch(() => null);

        if (dmChannel && interaction.guild) {
          await dmChannel.send({
            embeds: [
              new Embed(color)
                .setTitle('User removed from ticket')
                .setDescription(
                  `A user (${user}) can no longer view your ticket (${interaction.channel}) in ${interaction.guild.name}. This user was removed by ${interaction.user}.`,
                ),
            ],
          });
        }
      }
    }

    if (!config.logEvents.includes("remove")) return;
    const logChannel = interaction.guild?.channels.cache.get(config.logChannel);
    if (!logChannel?.isTextBased()) return;
    if (!hasSendPerms(logChannel))
      return await interaction.followUp({
        embeds: [new Embed(color).setDescription("Didn't send the log. I don't have the `SendMessages` permission.")],
        ephemeral: true,
      });

    await logChannel.send({
      embeds: [
        new Embed(color)
          .setTitle('User removed from ticket')
          .addFields(
            { name: 'User', value: `${user}`, inline: true },
            {
              name: 'Ticket',
              value: `${interaction.channel}`,
              inline: true,
            },
            { name: 'Removed By', value: `${interaction.user}`, inline: true },
          )
          .setFooter({ text: `ID: ${ids.ticketId}` }),
      ],
    });
  },
};
