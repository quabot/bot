import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';
import { checkUserPerms } from '@functions/ticket';

export default {
  parent: 'ticket',
  name: 'rename',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getTicketConfig(client, interaction.guildId!);
    const ids = await getIdConfig(interaction.guildId!, client);
    const newTopic = interaction.options.getString('new-topic', true);

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
        embeds: [new Embed(color).setDescription('This ticket is closed, reopen it to change the topic.')],
      });

    const valid = checkUserPerms(ticket, interaction.user, interaction.member);
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to change the ticket topic.')],
      });

    const ticketMsg = (await interaction.channel?.messages.fetch())?.last();
    if (ticketMsg?.author.id === process.env.CLIENT_ID!) {
      await ticketMsg.edit({
        embeds: [
          new Embed(color)
            .setTitle('New Ticket')
            .setDescription('Please wait, staff will be with you shortly.')
            .addFields(
              { name: 'Topic', value: `${newTopic}`, inline: true },
              { name: 'Topic', value: `<@${ticket.owner}>`, inline: true },
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

    ticket.topic = newTopic;
    await ticket.save();

    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`Changed the topic to \`${newTopic}\`.`)],
    });
  },
};
