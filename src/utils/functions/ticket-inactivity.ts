import type { Client } from '@classes/discord';
import { getIdConfig } from '@configs/idConfig';
import { getTicketConfig } from '@configs/ticketConfig';
import { Embed } from '@constants/embed';
import Ticket from '@schemas/Ticket';
import type { NonNullMongooseReturn } from '@typings/mongoose';
import type { ITicket } from '@typings/schemas';
import discordTranscripts from 'discord-html-transcripts';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  GuildTextBasedChannel,
  PrivateThreadChannel,
  PublicThreadChannel,
} from 'discord.js';
import { hasSendPerms } from './discord';

export async function ticketInactivity(client: Client, document: NonNullMongooseReturn<ITicket>) {
  const guild = client.guilds.cache.get(`${document.guildId}`);
  if (!guild) return;

  const config = await getTicketConfig(client, document.guildId);
  if (!config) return;

  const channel = await guild.channels.fetch(`${document.channelId}`).catch(() => null);
  if (!channel) return;

  if (!channel.isTextBased()) return;

  const textChannel = channel as GuildTextBasedChannel;

  const lastMessage = await textChannel.messages.fetch({ limit: 1 });
  if (!lastMessage) return;

  const lastMessageTime = lastMessage.first()?.createdTimestamp;
  if (!lastMessageTime) return;

  const currentTime = Date.now();
  const timeDiff = currentTime - lastMessageTime;

  if (config.autoRemind) {
    if (timeDiff >= config.autoRemindDays * 86400000) {
      channel.send({
        content: `<@${document.owner}>`,
        embeds: [
          new Embed('#416683').setDescription(
            `You have not responded in ${config.autoRemindDays} days. Please respond so our staff can help you. ${
              config.autoClose
                ? `If you do not respond within ${
                    config.autoCloseDays - config.autoRemindDays
                  } days, this ticket will be closed.`
                : ''
            }`,
          ),
        ],
      });
    }
  }

  if (config.autoClose) {
    if (timeDiff >= config.autoCloseDays * 86400000) {
      channel.send({
        content: `<@${document.owner}>`,
        embeds: [
          new Embed('#416683').setDescription(
            `You have not responded in ${config.autoCloseDays} days. This ticket will now be closed.`,
          ),
        ],
      });

      const ids = await getIdConfig(document.guildId!);

      if (!config || !ids) return;

      if (!config.enabled) return;

      const ticket = await Ticket.findOne({
        channelId: document.channelId,
      });
      if (!ticket) return;

      if (ticket.closed) return;

      const closedCategory = guild?.channels.cache.get(config.closedCategory);
      if (!closedCategory)
        return await channel.send({
          embeds: [
            new Embed('#416683').setDescription(
              'There is no category to move this ticket to once closed. Configure this on our [dashboard](https://quabot.net/dashboard).',
            ),
          ],
        });

      if (closedCategory.type !== ChannelType.GuildCategory)
        return await channel.send({
          embeds: [new Embed('#416683').setDescription("The closed ticket category doesn't have the right type.")],
        });

      const interChannel = channel as GuildTextBasedChannel | null;
      if (interChannel?.type === ChannelType.PrivateThread || interChannel?.type === ChannelType.PublicThread)
        return await channel.send({
          embeds: [new Embed('#416683').setDescription("This channel doesn't have the right type.")],
        });

      const ticketChannel = interChannel as Exclude<GuildTextBasedChannel, PrivateThreadChannel | PublicThreadChannel>;

      await ticketChannel?.setParent(closedCategory, {
        lockPermissions: false,
      });

      const owner = await guild?.members.fetch(ticket.owner);
      if (owner)
        await ticketChannel?.permissionOverwrites.edit(owner.user, {
          ViewChannel: true,
          SendMessages: false,
        });
      ticket.users!.forEach(async user => {
        const member = await guild?.members.fetch(user);
        if (member)
          await ticketChannel?.permissionOverwrites.edit(member.user, {
            ViewChannel: true,
            SendMessages: false,
          });
      });

      ticket.closed = true;
      await ticket.save();

      await channel.send({
        embeds: [
          new Embed('#416683')
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

      if (config.dmEnabled && config.dmEvents.includes('close')) {
        const ticketOwner = await guild?.members.fetch(ticket.owner).catch(() => null);

        if (ticketOwner) {
          const dmChannel = await ticketOwner.user.createDM().catch(() => null);

          if (dmChannel && guild) {
            await dmChannel.send({
              embeds: [
                new Embed('#416683')
                  .setTitle('Ticket Closed')
                  .setDescription(
                    `Your ticket (${channel}) in ${guild.name} was closed due to inactivity. If you need further assistance, feel free to open another ticket or reopen your current ticket.`,
                  ),
              ],
            });
          }
        }
      }

      if (!config.logEvents.includes('close')) return;
      const attachment = await discordTranscripts.createTranscript(channel, {
        limit: -1,
        saveImages: false,
      });

      const logChannel = guild?.channels.cache.get(config.logChannel);
      if (!logChannel?.isTextBased() || !config.logEnabled) return;
      if (!hasSendPerms(logChannel)) return;

      if (!config.autoDeleteOnClose)
        await logChannel.send({
          embeds: [
            new Embed('#416683')
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
                  value: `${channel}`,
                  inline: true,
                },
                { name: 'Closed By', value: `System, autoclose due to inactivity.`, inline: true },
              )
              .setFooter({ text: `ID: ${ticket.id}` }),
          ],
          files: [attachment],
        });

      if (config.autoDeleteOnClose) {
        await logChannel.send({
          embeds: [
            new Embed('#416683')
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
                  value: `${channel}`,
                  inline: true,
                },
                {
                  name: 'Deleted By',
                  value: `System, autoclose and subsequent delete due to inactivity`,
                  inline: true,
                },
              )
              .setFooter({ text: `ID: ${ticket.id}` }),
          ],
          files: [attachment],
        });

        await channel?.delete();

        await Ticket.findOneAndDelete({
          id: ticket.id,
          guildId: document.guildId!,
        });
      }
    }
  }

  setTimeout(async () => {
    const ticketFetched = await Ticket.findOne({
      id: document.id,
      guildId: document.guildId,
      owner: document.owner,
    });
    if (!ticketFetched) return;
    if (ticketFetched.closed) return;

    ticketInactivity(client, ticketFetched);
  }, 60000);
}
