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

    const owner = await interaction.guild?.members.fetch(ticket.owner);
    if (owner)
      await channel?.permissionOverwrites.edit(owner.user, {
        ViewChannel: true,
        SendMessages: false,
      });
    ticket.users!.forEach(async user => {
      const member = await interaction.guild?.members.fetch(user);
      if (member)
        await channel?.permissionOverwrites.edit(member.user, {
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

    if (!config.autoDeleteOnClose)
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

    if (config.dmEnabled && config.dmEvents.includes('close')) {
      const ticketOwner = await interaction.guild?.members.fetch(ticket.owner).catch(() => null);
      
      if (ticketOwner) {
        const dmChannel = await ticketOwner.user.createDM().catch(() => null);

        if (dmChannel && interaction.guild) {
          await dmChannel.send({
            embeds: [
              new Embed(color)
                .setTitle('Ticket Closed')
                .setDescription(
                  `Your ticket (${interaction.channel}) in ${interaction.guild.name} was closed. If you need further assistance, feel free to open another ticket or reopen your current ticket.`,
                ),
            ],
          });
        }
      }
    }

    if (!config.logEvents.includes('close')) return;
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

    if (!config.autoDeleteOnClose)
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

    if (config.autoDeleteOnClose) {
      await logChannel.send({
        embeds: [
          new Embed(color)
            .setTitle('Ticket Deleted')
            .setDescription('Ticket transcript added as attachment. The ticket was closed and subsequently deleted.')
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

      await interaction.channel?.delete();

      await Ticket.findOneAndDelete({
        id: ticket.id,
        guildId: interaction.guildId!,
      });
    }
  },
};
