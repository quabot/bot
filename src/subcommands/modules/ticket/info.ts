const {
  ChatInputCommandInteraction,
  Client,
  ColorResolvable,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { getTicketConfig } = require('@configs/ticketConfig');
const Ticket = require('@schemas/Ticket');
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'ticket',
  name: 'info',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getTicketConfig(client, interaction.guildId);
    const ids = await getIdConfig(interaction.guildId);

    if (!config || !ids)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use! Please run the command again.",
          ),
        ],
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

    await interaction.editReply({
      embeds: [
        new Embed(color).setTitle(`🎫 Ticket ${ticket.id}`).setDescription(`
                    **💻 Channel:** ${interaction.channel}
                    **📝 Created by**: <@${ticket.owner}>
                    **👥 Users:** ${ticket.users.forEach(u => `<@${u}>`) ?? 'No users have been added'}
                    **🙋‍♂️ Claimed by:** ${ticket.staff === 'none' ? 'Unclaimed' : `<@${ticket.staff}>`}
                    **🔒 Closed:** ${ticket.closed ? 'Yes' : 'No'}
                    **❓ Topic:** ${ticket.topic ?? 'No topic given'}
                    `),
      ],
    });
  },
};
