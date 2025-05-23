import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, type GuildTextBasedChannel } from 'discord.js';
import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  parent: 'ticket',
  name: 'unclaim',

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

    if (hasSendPerms(interaction.channel as GuildTextBasedChannel | null))
      await (interaction.channel as TextChannel)?.send({
        embeds: [new Embed(color).setDescription('This ticket is no longer claimed.')],
      });

      if (config.dmEnabled && config.dmEvents.includes('unclaim')) {
        const ticketOwner = await interaction.guild?.members.fetch(ticket.owner).catch(() => null);
  
        if (ticketOwner) {
          const dmChannel = await ticketOwner.user.createDM().catch(() => null);
  
          if (dmChannel && interaction.guild) {
            await dmChannel.send({
              embeds: [
                new Embed(color)
                  .setTitle('Ticket Unclaimed')
                  .setDescription(
                    `Your ticket (${interaction.channel}) in ${interaction.guild.name} is no longer claimed.`,
                  ),
              ],
            });
          }
        }
      }

    if (!config.logEvents.includes('unclaim')) return;

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
