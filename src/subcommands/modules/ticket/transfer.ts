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
  name: 'transfer',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });
    const user = interaction.options.getUser('user');

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

    if (!user) return;

    let valid = false;
    if (ticket.owner === interaction.user.id) valid = true;
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to transfer the ticket ownership.')],
      });

    if (!ticket.users.includes(user.id))
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please add the user to the ticket before changing the ownership.')],
      });

    const array = ticket.users;

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

    const ticketMsg = (await interaction.channel.messages.fetch()).last();
    if (ticketMsg.author.id === process.env.CLIENT_ID) {
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
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close-ticket').setLabel('🔒 Close').setStyle(ButtonStyle.Secondary),
          ),
        ],
      });
    }

    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`Made ${user} the ticket owner.`)],
    });
  },
};
