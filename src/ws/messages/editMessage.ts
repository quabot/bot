import { GuildParser } from '@classes/parsers';
import { CustomEmbed } from '@constants/customEmbed';
import { hasSendPerms } from '@functions/discord';
import type { WsEventArgs } from '@typings/functionArgs';

//* QuaBot Dashboard Message Sender Handler.
export default {
  code: 'message-edit-guild',
  async execute({ client, data }: WsEventArgs) {
    //* Get the guild and channel.
    const guild = client.guilds.cache.get(data.guildId);
    if (!guild) return;
    const channel = guild.channels.cache.get(data.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    const messageId = data.messageId;
    if (!messageId) return;

    const messageEmbed = data.messageEmbed;
    if (!messageEmbed) return;
    //@ts-ignore
    const testMessage = (msg: any): msg is CustomEmbed => {
      return true;
    };
    if (!testMessage(data.message)) return;

    //* Send the message.
    const parser = new GuildParser(guild);

    const sentEmbed = new CustomEmbed(messageEmbed, parser);

    //* Find the message in the channel.
    const message = await channel.messages.fetch(messageId);
    if (!message) return;
    await message.edit({
      embeds: [sentEmbed],
      content: parser.parse(messageEmbed.content) ?? '',
    })
  },
};
