import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildTextBasedChannel,
  PrivateThreadChannel,
  PublicThreadChannel,
  ChannelType,
} from 'discord.js';
import Ticket from '@schemas/Ticket';
import { getIdConfig } from '@configs/idConfig';
import { getTicketConfig } from '@configs/ticketConfig';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import discordTranscripts from 'discord-html-transcripts';
import { checkUserPerms } from '@functions/ticket';
import { hasSendPerms } from '@functions/discord';

export default {
  name: 'close-ticket',

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

    if (ticket.closed)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This ticket is already closed.')],
      });

    const valid = checkUserPerms(ticket, interaction.user, interaction.member);
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to close the ticket.')],
      });

    const closedCategory = interaction.guild?.channels.cache.get(config.closedCategory);
    if (!closedCategory)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'There is no category to move this ticket to once closed. Configure this on our [dashboard](https://quabot.net/dashboard).',
          ),
        ],
      });
    if (closedCategory.type !== ChannelType.GuildCategory)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("The closed ticket category doesn't have the right type.")],
      });

    const interChannel = interaction.channel as GuildTextBasedChannel | null;
    if (interChannel?.type === ChannelType.PrivateThread || interChannel?.type === ChannelType.PublicThread)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("This channel doesn't have the right type.")],
      });

    const channel = interChannel as Exclude<GuildTextBasedChannel, PrivateThreadChannel | PublicThreadChannel>;

    await channel?.setParent(closedCategory, {
      lockPermissions: false,
    });

    await channel?.permissionOverwrites.edit(ticket.owner, {
      ViewChannel: true,
      SendMessages: false,
    });
    ticket.users!.forEach(async user => {
      const member = await interaction.guild?.members.fetch(user);
      if (member) await channel?.permissionOverwrites.edit(member, {
        ViewChannel: true,
        SendMessages: false,
      });
    });

    await interaction.message.edit({
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId('close-ticket')
            .setLabel('🔒 Close')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        ),
      ],
    });

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('Ticket Closed')
          .setDescription('Reopen, delete or get a transcript with the buttons below this message.'),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .setComponents(
            new ButtonBuilder().setCustomId('reopen-ticket').setLabel('🔓 Reopen').setStyle(ButtonStyle.Primary),
          )
          .addComponents(
            new ButtonBuilder().setCustomId('delete-ticket').setLabel('🗑️ Delete').setStyle(ButtonStyle.Danger),
          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId('transcript-ticket')
              .setLabel('📝 Transcript')
              .setStyle(ButtonStyle.Success),
          ),
      ],
    });

    ticket.closed = true;
    await ticket.save();

    const attachment = await discordTranscripts.createTranscript(interaction.channel!, {
      limit: -1,
      saveImages: false,
    });

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
          .setTitle('Ticket Closed')
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
            { name: 'Closed By', value: `${interaction.user}`, inline: true },
          )
          .setFooter({ text: `ID: ${ticket.id}` }),
      ],
      files: [attachment],
    });
  },
};
