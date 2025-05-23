import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Ticket from '@schemas/Ticket';
import { getIdConfig } from '@configs/idConfig';
import { getTicketConfig } from '@configs/ticketConfig';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import discordTranscripts from 'discord-html-transcripts';
import { checkUserPerms } from '@functions/ticket';
import { hasSendPerms } from '@functions/discord';

export default {
  name: 'confirm-delete-ticket',

  async execute({ client, interaction, color }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: false });

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

    if (!ticket.closed)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This ticket is not closed.')],
      });

    const valid = checkUserPerms(ticket, interaction.user, interaction.member);
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to delete the ticket.')],
      });

    await interaction.message.edit({
      embeds: [
        new Embed(color)
          .setTitle('Are you sure you want to delete the ticket?')
          .setDescription("This cannot be undone. Click 'Confirm' to delete it."),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .setComponents(
            new ButtonBuilder()
              .setCustomId('cancel-delete-ticket')
              .setLabel('❌ Cancel')
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true),
          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId('confirm-delete-ticket')
              .setLabel('✅ Confirm')
              .setStyle(ButtonStyle.Success)
              .setDisabled(true),
          ),
      ],
    });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Deleting the ticket.')],
    });

    const attachment = await discordTranscripts.createTranscript(interaction.channel!, {
      limit: -1,
      saveImages: false,
    });

    const logChannel = interaction.guild?.channels.cache.get(config.logChannel);

    await interaction.channel?.delete();

    await Ticket.findOneAndDelete({
      id: ticket.id,
      guildId: interaction.guildId,
    });
    
    if (config.dmEnabled && config.dmEvents.includes('delete')) {
      const ticketOwner = await interaction.guild?.members.fetch(ticket.owner).catch(() => null);
      
      if (ticketOwner) {
        const dmChannel = await ticketOwner.user.createDM().catch(() => null);

        if (dmChannel && interaction.guild) {
          await dmChannel.send({
            embeds: [
              new Embed(color)
                .setTitle('Ticket Deleted')
                .setDescription(
                  `Your ticket in ${interaction.guild.name} was deleted. If you need further assistance, feel free to open another ticket. The transcript for your deleted ticket can be found above this message.`,
                ),
            ],
            files: [attachment]
          });
        }
      }
    }

    if (!config.logEvents.includes("delete")) return;
    if (!logChannel?.isTextBased() || !config.logEnabled) return;
    if (!hasSendPerms(logChannel))
      return await interaction.followUp({
        embeds: [new Embed(color).setDescription("Didn't send the log. I don't have the `SendMessages` permission.")],
        ephemeral: true,
      });

    await logChannel.send({
      embeds: [
        new Embed(color)
          .setTitle('Ticket Deleted')
          .setDescription('Ticket transcript added as attachment.')
          .addFields(
            {
              name: 'Ticket Owner',
              value: `<@${ticket.owner}>`,
              inline: true,
            },
            {
              name: 'Deleted By',
              value: `${interaction.user}`,
              inline: true,
            },
          )
          .setFooter({ text: `ID: ${ticket.id}` }),
      ],
      files: [attachment],
    });
  },
};
