import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  type GuildTextBasedChannel,
  type PrivateThreadChannel,
  type PublicThreadChannel,
} from 'discord.js';
import Ticket from '@schemas/Ticket';
import { getIdConfig } from '@configs/idConfig';
import { getTicketConfig } from '@configs/ticketConfig';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import { checkUserPerms } from '@functions/ticket';
import { hasSendPerms } from '@functions/discord';
import { ChannelType } from 'discord.js';
import { TicketParser } from '@classes/parsers';
import { CustomEmbed } from '@constants/customEmbed';

export default {
  name: 'reopen-ticket',

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
        embeds: [new Embed(color).setDescription("This ticket isn't closed.")],
      });

    const valid = checkUserPerms(ticket, interaction.user, interaction.member);
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to close the ticket.')],
      });

    const openCategory = interaction.guild?.channels.cache.get(config.openCategory);
    if (!openCategory)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'There is no category to move this ticket to once reopened. Configure this on our [dashboard](https://quabot.net/dashboard).',
          ),
        ],
      });
    if (openCategory.type !== ChannelType.GuildCategory)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("The open ticket category doesn't have the right type.")],
      });

    const interChannel = interaction.channel as GuildTextBasedChannel | null;
    if (interChannel?.type === ChannelType.PrivateThread || interChannel?.type === ChannelType.PublicThread)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("This channel doesn't have the right type.")],
      });

    const channel = interChannel as Exclude<GuildTextBasedChannel, PrivateThreadChannel | PublicThreadChannel>;

    await channel?.setParent(openCategory, {
      lockPermissions: false,
    });

    await channel?.permissionOverwrites.edit(ticket.owner, {
      ViewChannel: true,
      SendMessages: true,
    });
    ticket.users!.forEach(async user => {
      await channel?.permissionOverwrites.edit(user, {
        ViewChannel: true,
        SendMessages: true,
      });
    });

    await interaction.message.edit({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .setComponents(
            new ButtonBuilder()
              .setCustomId('reopen-ticket')
              .setLabel('🔓 Reopen')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true),
          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId('delete-ticket')
              .setLabel('🗑️ Delete')
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true),
          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId('transcript-ticket')
              .setLabel('📝 Transcript')
              .setStyle(ButtonStyle.Success)
              .setDisabled(true),
          ),
      ],
    });

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('Ticket Reopened')
          .setDescription('Close the ticket with the button below this message'),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setCustomId('close-ticket').setLabel('🔒 Close').setStyle(ButtonStyle.Primary),
        ),
      ],
    });

    ticket.closed = false;
    await ticket.save();

    const {
      dmMessages: { reopen },
    } = config;
    if (reopen.enabled) {
      const parser = new TicketParser({
        member: interaction.member as GuildMember,
        color,
        channel: interaction.channel as GuildTextBasedChannel,
        ticket,
      });
      const owner = client.users.cache.get(ticket.owner);

      await owner
        ?.send(
          reopen.type === 'embed'
            ? { embeds: [new CustomEmbed(reopen.message, parser)] }
            : { content: parser.parse(reopen.message.content) },
        )
        .catch(() => null);
    }

    const logChannel = interaction.guild?.channels.cache.get(config.logChannel);
    if (!config.logEnabled || !logChannel?.isTextBased() || !config.logActions.includes('reopen')) return;
    if (!hasSendPerms(logChannel))
      return await interaction.followUp({
        embeds: [new Embed(color).setDescription("Didn't send the log, I don't have the `SendMessages` permission.")],
        ephemeral: true,
      });

    await logChannel.send({
      embeds: [
        new Embed(color)
          .setTitle('Ticket Reopened')
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
              name: 'Reopened By',
              value: `${interaction.user}`,
              inline: true,
            },
          )
          .setFooter({ text: `ID: ${ticket.id}` }),
      ],
    });
  },
};
