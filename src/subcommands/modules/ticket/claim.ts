import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, GuildTextBasedChannel } from 'discord.js';
import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';
import { checkUserPerms } from '@functions/ticket';
import { hasAnyRole, hasSendPerms } from '@functions/discord';
import { TicketParser } from '@classes/parsers';
import { CustomEmbed } from '@constants/customEmbed';

export default {
  parent: 'ticket',
  name: 'claim',

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

    const ticket = await Ticket.findOne({
      channelId: interaction.channelId,
    });
    if (!ticket)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This is not a valid ticket.')],
      });

    if (ticket.staff !== 'none')
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('The ticket is already claimed.')],
      });

    const allowed =
      checkUserPerms(ticket, interaction.user, interaction.member) ||
      hasAnyRole(interaction.member, config.staffRoles!);
    if (!allowed)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to claim this ticket.')],
      });

    ticket.staff = interaction.user.id;
    await ticket.save();

    const ticketMsg = (await interaction.channel?.messages.fetch())?.first();
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
            { name: 'Claimed By', value: `${interaction.user}`, inline: true },
          ),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setCustomId('close-ticket').setLabel('🔒 Close').setStyle(ButtonStyle.Secondary),
        ),
      ],
    });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('You have successfully claimed the ticket.')],
    });

    if (hasSendPerms(interaction.channel as GuildTextBasedChannel | null))
      await interaction.channel?.send({
        embeds: [new Embed(color).setDescription(`This ticket has been claimed by ${interaction.user}.`)],
      });

    const {
      dmMessages: { claim },
    } = config;
    if (claim.enabled) {
      const parser = new TicketParser({
        member: interaction.member as GuildMember,
        color,
        channel: interaction.channel as GuildTextBasedChannel,
        ticket,
      });
      const owner = client.users.cache.get(ticket.owner);

      await owner
        ?.send(
          claim.type === 'embed'
            ? { embeds: [new CustomEmbed(claim.message, parser)] }
            : { content: parser.parse(claim.message.content) },
        )
        .catch(() => null);
    }

    const logChannel = interaction.guild?.channels.cache.get(config.logChannel);
    if (!config.logEnabled || !logChannel?.isTextBased() || !config.logActions.includes('claim')) return;
    if (!hasSendPerms(logChannel))
      return await interaction.followUp({
        embeds: [new Embed(color).setDescription("Didn't send the log, I don't have the `SendMessages` permission.")],
        ephemeral: true,
      });

    await logChannel.send({
      embeds: [
        new Embed(color)
          .setTitle('Ticket Claimed')
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
            {
              name: 'Claimed By',
              value: `${interaction.user}`,
              inline: true,
            },
          )
          .setFooter({ text: `ID: ${ticket.id}` }),
      ],
    });
  },
};
