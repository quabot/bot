import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { CustomEmbed } from '@constants/customEmbed';
import type { WsEventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';
import { BaseParser } from '@classes/parsers';

//* QuaBot Applications Message Sender Handler.
export default {
  code: 'send-message-applications',
  async execute({ client, data }: WsEventArgs) {
    //* Ge the guild, channel, id and embed.
    const guild = client.guilds.cache.get(data.guildId);
    if (!guild) return;
    const channel = guild.channels.cache.get(data.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    const embed = data.embed;
    const applicationId = data.id;
    if (!applicationId) return;

    //* Send the message.
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('applications-fill-' + applicationId)
        .setLabel('Apply')
        .setStyle(ButtonStyle.Primary),
    );

    if (!embed)
      return await channel.send({
        content: data.message.content,
        components: [row],
      });

    const sentEmbed = new CustomEmbed(data.message, new BaseParser());

    await channel.send({
      embeds: [sentEmbed],
      content: data.message.content ?? '',
      components: [row],
    });
  },
};
