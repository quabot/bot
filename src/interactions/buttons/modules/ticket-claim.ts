import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildTextBasedChannel, TextChannel } from 'discord.js';
import Ticket from '@schemas/Ticket';
import { getIdConfig } from '@configs/idConfig';
import { getTicketConfig } from '@configs/ticketConfig';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import { checkUserPerms } from '@functions/ticket';
import { hasAnyRole, hasSendPerms } from '@functions/discord';

export default {
  name: 'claim-ticket',

  async execute({ client, interaction, color }: ButtonArgs) {
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

    let allowed =
      checkUserPerms(ticket, interaction.user, interaction.member) ||
      hasAnyRole(interaction.member, config.staffRoles!);
    if (ticket.owner === interaction.user.id) allowed = false;
    if (!allowed)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to claim this ticket.')],
      });

    ticket.staff = interaction.user.id;
    await ticket.save();

    const ticketMsg = interaction.channel?.messages.cache.first();
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
      await (interaction.channel as TextChannel)?.send({
        embeds: [new Embed(color).setDescription(`This ticket has been claimed by ${interaction.user}.`)],
      });

      if (config.dmEnabled && config.dmEvents.includes('claim')) {
        const ticketOwner = await interaction.guild?.members.fetch(ticket.owner).catch(() => null);
  
        if (ticketOwner) {
          const dmChannel = await ticketOwner.user.createDM().catch(() => null);
  
          if (dmChannel && interaction.guild) {
            await dmChannel.send({
              embeds: [
                new Embed(color)
                  .setTitle('Ticket Claimed')
                  .setDescription(
                    `Your ticket (${interaction.channel}) in ${interaction.guild.name} has been claimed by ${interaction.user}.`,
                  ),
              ],
            });
          }
        }
      }

    if (!config.logEvents.includes('claim')) return;
    const logChannel = interaction.guild?.channels.cache.get(config.logChannel);
    if (!logChannel?.isTextBased() || !config.logEnabled) return;
    if (!hasSendPerms(logChannel))
      return await interaction.followUp({
        embeds: [new Embed(color).setDescription("Didn't send the log. I don't have the `SendMessages` permission.")],
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
