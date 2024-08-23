import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { CustomEmbed } from '@constants/customEmbed';
import type { WsEventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';
import { GuildParser } from '@classes/parsers';

//* QuaBot Suggestion Message Sender Handler.
export default {
  code: 'send-message-suggestion',
  async execute({ client, data }: WsEventArgs) {
    //* Get the server and channel & embed.
    const guild = client.guilds.cache.get(data.guildId);
    if (!guild) return;
    const channel = guild.channels.cache.get(data.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    const embed = data.embedEnabled;

    //* Send the message to the channel.
    const parser = new GuildParser(guild);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('suggestion-create').setLabel('💡 Suggest').setStyle(ButtonStyle.Secondary),
    );

    if (!embed)
      return await channel.send({
        content: parser.parse(data.message.content) ?? '',
        components: [row],
      });

    const sentEmbed = new CustomEmbed(data.message, parser);

    await channel.send({
      embeds: [sentEmbed],
      content: parser.parse(data.message.content) ?? null,
      components: [row],
    });
  },
};
