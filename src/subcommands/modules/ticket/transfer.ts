import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  parent: 'ticket',
  name: 'transfer',

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

    let valid = false;
    if (ticket.owner === interaction.user.id) valid = true;
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to transfer the ticket ownership.')],
      });

    if (!ticket.users!.includes(user.id))
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please add the user to the ticket before changing the ownership.')],
      });

    const array = ticket.users!;

    for (var i = 0; i < array.length; i++) {
      if (array[i] === `${user.id}`) {
        array.splice(i, 1);
        i--;
      }
    }

    await ticket.updateOne({
      users: array,
      owner: user.id,
    });

    const ticketMsg = (await interaction.channel?.messages.fetch())?.last();
    if (ticketMsg?.author.id === process.env.CLIENT_ID!) {
      await ticketMsg.edit({
        embeds: [
          new Embed(color)
            .setTitle('New Ticket')
            .setDescription('Please wait, staff will be with you shortly.')
            .addFields(
              { name: 'Topic', value: `${ticket.topic}`, inline: true },
              { name: 'Topic', value: `${user}`, inline: true },
              {
                name: 'Claimed By',
                value: `${ticket.staff === 'none' ? 'Unclaimed' : `<@${ticket.staff}>`}`,
                inline: true,
              },
            ),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder().setCustomId('close-ticket').setLabel('🔒 Close').setStyle(ButtonStyle.Secondary),
          ),
        ],
      });
    }

    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`Made ${user} the ticket owner.`)],
    });

    if (!config.logEvents.includes("transfer")) return;
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
          .setTitle('Ticket Owner Transferred')
          .addFields(
            { name: 'Old Owner', value: `${interaction.user}`, inline: true },
            { name: 'New Owner', value: `${user}`, inline: true },
            {
              name: 'Ticket',
              value: `${interaction.channel}`,
              inline: true,
            },
          )
          .setFooter({ text: `ID: ${ids.ticketId}` }),
      ],
    });
  },
};
