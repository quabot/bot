import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from 'discord.js';
import { CustomEmbed } from '@constants/customEmbed';
import type { WsEventArgs } from '@typings/functionArgs';

//* QuaBot Ticket Message Sender Handler.
export default {
  code: 'send-message-ticket',
  async execute({ client, data }: WsEventArgs) {
    //* Get the server and channel & embed.
    const guild = client.guilds.cache.get(data.guildId);
    if (!guild) return;
    const channel = guild.channels.cache.get(data.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;

    const embed = data.embedEnabled;

    //* Send the message to the channel.
    const getParsedString = (s: string) => {
      return `${s}`
        .replaceAll('{guild}', guild.name)
        .replaceAll('{members}', guild.memberCount.toString())
        .replaceAll('{color}', '#416683');
    };
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('ticket-create').setLabel('Create Ticket').setStyle(ButtonStyle.Secondary),
    );

    if (!embed)
      return await channel.send({
        content: getParsedString(data.message.content) ?? '',
        components: [row],
      });

    const sentEmbed = new CustomEmbed(data.message, getParsedString);

    await channel.send({
      embeds: [sentEmbed],
      content: getParsedString(data.message.content) ?? null,
      components: [row],
    });
  },
};
