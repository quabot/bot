import { hasSendPerms } from '@functions/discord';
import type { WsEventArgs } from '@typings/functionArgs';

//* QuaBot Dashboard Message Sender Handler.
export default {
  code: 'message-delete-guild',
  async execute({ client, data }: WsEventArgs) {
    //* Get the guild and channel.
    const guild = client.guilds.cache.get(data.guildId);
    if (!guild) return;
    const channel = guild.channels.cache.get(data.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    const messageId = data.messageId;
    if (!messageId) return;

    //* Find the message in the channel.
    const message = await channel.messages.fetch(messageId);
    if (!message) return;
    await message.delete();
  },
};
