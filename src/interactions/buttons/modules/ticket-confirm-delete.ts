import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from 'discord.js';
import Ticket from '@schemas/Ticket';
import { getIdConfig } from '@configs/idConfig';
import { getTicketConfig } from '@configs/ticketConfig';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import discordTranscripts from 'discord-html-transcripts';
import { checkUserPerms } from '@functions/ticket';

export default {
  name: 'confirm-delete-ticket',

  async execute({ client, interaction, color }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: false });

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
      //! This isn't a thing, what do you want to do?
      //minify: true,
      saveImages: false,
      //! This isn't a thing, what do you want to do?
      //useCND: true,
    });

    const logChannel = interaction.guild?.channels.cache.get(config.logChannel);

    await interaction.channel?.delete();

    await Ticket.findOneAndDelete({
      id: ticket.id,
      guildId: interaction.guildId,
    });

    if (
      !logChannel ||
      logChannel.type === ChannelType.GuildCategory ||
      logChannel.type === ChannelType.GuildForum ||
      !config.logEnabled
    )
      return;

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
              name: 'Channel',
              value: `${interaction.channel}`,
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
