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
  name: 'rename',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getTicketConfig(client, interaction.guildId);
    const ids = await getIdConfig(interaction.guildId);
    const newTopic = interaction.options.getString('new-topic');

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

    if (ticket.closed)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This ticket is closed, reopen it to change the topic.')],
      });

    let valid = false;
    if (ticket.owner === interaction.user.id) valid = true;
    if (ticket.users.includes(interaction.user.id)) valid = true;
    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) valid = true;
    if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) valid = true;
    if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) valid = true;
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to change the ticket topic.')],
      });

    const ticketMsg = (await interaction.channel.messages.fetch()).last();
    if (ticketMsg.author.id === process.env.CLIENT_ID) {
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
          new ActionRowBuilder().addComponents(
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
