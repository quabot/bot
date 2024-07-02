import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } from 'discord.js';
import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  parent: 'ticket',
  name: 'create',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

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

    const topic = interaction.options.getString('topic');
    if (!topic)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter all the required fields.')],
      });

    const category = interaction.guild?.channels.cache.get(config.openCategory);
    if (!category || category.type !== ChannelType.GuildCategory)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            `Couldn't find any valid configured categories for tickets. You can do this on our [dashboard](https://quabot.net/dashboard/${interaction.guildId}/modules/tickets).`,
          ),
        ],
      });

    if (
      !(
        interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageChannels) &&
        interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)
      )
    )
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "I don't have the `Manage Channels` & `Manage Roles` permission, please contact a staff member from this server.",
          ),
        ],
      });

    if (!category.members.has(client.user?.id ?? ''))
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            `I don't have access to the configured category for tickets, please contact a staff member from this server.`,
          ),
        ],
      });

    const userTickets = await Ticket.find({
      guildId: interaction.guildId,
      owner: interaction.user.id,
      closed: false
    });
    if (userTickets.length >= config.ticketLimitUser)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription(`You have reached the maximum amount of tickets, you can only have ${config.ticketLimitUser} open tickets.`)],
      });

    const totalTickets = await Ticket.find({
      guildId: interaction.guildId,
      closed: false
    });
    if (totalTickets.length >= config.ticketLimitGlobal)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription(`The server has reached the maximum amount of tickets, there can only be ${config.ticketLimitGlobal} open tickets, as configured by this server's moderators.`)],
      });

    const channel = await interaction.guild?.channels.create({
      name: `ticket-${ids.ticketId}`,
      type: ChannelType.GuildText,
    });
    if (!channel)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to create the channel.')],
      });

    await channel.setParent(category, { lockPermissions: true });
    channel.permissionOverwrites.create(interaction.guild!.id, {
      ViewChannel: false,
      SendMessages: false,
    });
    channel.permissionOverwrites.create(interaction.user.id, {
      ViewChannel: true,
      SendMessages: true,
    });

    config.staffRoles!.forEach(r => {
      const role = interaction.guild?.roles.cache.get(r);
      if (role)
        channel.permissionOverwrites.create(role, {
          ViewChannel: true,
          SendMessages: true,
        });
    });

    await channel.send({
      embeds: [
        new Embed(color)
          .setTitle('New Ticket')
          .setDescription('Please wait, staff will be with you shortly.')
          .addFields(
            { name: 'Topic', value: `${topic}`, inline: true },
            { name: 'Created By', value: `${interaction.user}`, inline: true },
            { name: 'Claimed by', value: 'Not claimed yet', inline: true },
          ),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setCustomId('close-ticket').setLabel('🔒 Close').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('claim-ticket').setLabel('🙋‍♂️ Claim').setStyle(ButtonStyle.Secondary),
        ),
      ],
    });

    const pingRole = interaction.guild?.roles.cache.get(config.staffPing);
    if (pingRole) await channel.send(`${pingRole}`);

    const newTicket = new Ticket({
      guildId: interaction.guildId,

      id: ids.ticketId,
      channelId: channel.id,

      topic,
      closed: false,

      owner: interaction.user.id,
      users: [],
      roles: [],
      staff: 'none',
    });
    await newTicket.save();

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('Ticket created!')
          .setDescription(`Check it out here: ${channel}, staff will be with you shortly.`),
      ],
    });

    ids.ticketId = ids.ticketId ? ids.ticketId + 1 : 0;
    await ids.save();

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
          .setTitle('Ticket Created')
          .addFields(
            { name: 'User', value: `${interaction.user}`, inline: true },
            {
              name: 'Channel',
              value: `${interaction.channel}`,
              inline: true,
            },
            { name: 'Topic', value: `${topic}`, inline: true },
          )
          .setFooter({ text: `ID: ${ids.ticketId}` }),
      ],
    });
  },
};
