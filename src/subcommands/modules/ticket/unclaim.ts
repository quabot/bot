import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from 'discord.js';
import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'ticket',
  name: 'unclaim',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

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

    if (ticket.staff !== interaction.user.id)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("The ticket isn't claimed by you.")],
      });

    ticket.staff = 'none';
    await ticket.save();

    const ticketMsg = (await interaction.channel?.messages.fetch())?.last();
    if (ticketMsg?.author.id !== process.env.CLIENT_ID!)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('There was an internal error. The original QuaBot message was deleted.'),
        ],
      });

    await ticketMsg.edit({
      embeds: [
        new Embed(color)
          .setTitle('New Ticket')
          .setDescription('Please wait, staff will be with you shortly.')
          .addFields(
            { name: 'Topic', value: `${ticket.topic}`, inline: true },
            { name: 'Topic', value: `<@${ticket.owner}>`, inline: true },
            { name: 'Claimed By', value: 'Unclaimed', inline: true },
          ),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setCustomId('close-ticket').setLabel('🔒 Close').setStyle(ButtonStyle.Secondary),
        ),
      ],
    });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('You have successfully unclaimed the ticket.')],
    });

    await interaction.channel?.send({
      embeds: [new Embed(color).setDescription('This ticket is no longer claimed.')],
    });

    const logChannel = interaction.guild?.channels.cache.get(config.logChannel);
    if (!logChannel || logChannel.type === ChannelType.GuildCategory || logChannel.type === ChannelType.GuildForum)
      return;

    await logChannel.send({
      embeds: [
        new Embed(color)
          .setTitle('Ticket Unclaimed')
          .addFields(
            {
              name: 'Ticket Owner',
              value: `<@${ticket.owner}>`,
              inline: true,
            },
            {
              name: 'Channel',
              value: `${interaction.channel}`,
              inline: true,
            },
            { name: 'Claimed By', value: 'Nobody', inline: true },
          )
          .setFooter({ text: `ID: ${ticket.id}` }),
      ],
    });
  },
};
