import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, TextChannel, type GuildMember } from 'discord.js';
import type { EventArgs } from '@typings/functionArgs';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getTicketConfig } from '@configs/ticketConfig';
import discordTranscripts from 'discord-html-transcripts'
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildMemberRemove,
  name: 'ticketCloseOnLeave',

  async execute({ client, color }: EventArgs, member: GuildMember) {
    const userTickets = await Ticket.find({ owner: member.id, closed: false });
    if (!userTickets) return;

    userTickets.forEach(async ticket => {
      await ticket.updateOne({ closed: true });

      const guild = member.guild;
      if (!guild) return;
      const channel = await guild.channels.fetch(ticket.channelId);
      if (!channel) return;

      const config = await getTicketConfig(client, guild.id);
      if (!config) return;

      const newChannel = channel as TextChannel;
      if (!newChannel.isTextBased()) return;

      await newChannel.send({
        embeds: [
          new Embed(color).setDescription('This ticket has been closed, the ticket owner has left this server.'),
        ],
      });

      if (!config.autoDeleteOnClose)
        await newChannel.send({
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
  
      const attachment = await discordTranscripts.createTranscript(newChannel, {
        limit: -1,
        saveImages: false,
      });
  
      const logChannel = guild.channels.cache.get(config.logChannel);
      if (!logChannel?.isTextBased() || !config.logEnabled) return;
      if (!hasSendPerms(logChannel))
        return await logChannel.send({
          embeds: [new Embed(color).setDescription("Didn't send the log message to the staff channel. I don't have the `SendMessages` permission.")]
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
                  value: `${channel}`,
                  inline: true,
                },
                { name: 'Closed By', value: `Auto close, owner left server.`, inline: true },
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
                  value: `${channel}`,
                  inline: true,
                },
                {
                  name: 'Deleted By',
                  value: `Auto close, owner left server.`,
                  inline: true,
                },
              )
              .setFooter({ text: `ID: ${ticket.id}` }),
          ],
          files: [attachment],
        });
  
        await channel.delete();
  
        await Ticket.findOneAndDelete({
          id: ticket.id,
          guildId: member.guild.id,
        });
      }
    });
  },
};
