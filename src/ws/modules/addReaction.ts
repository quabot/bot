import type { WsEventArgs } from '@typings/functionArgs';
import { ChannelType } from 'discord.js';

//* Add a reaction to a message for reactionroles.
export default {
  code: 'add-reaction',
  async execute({ client, data }: WsEventArgs) {
    //* Get all the required variables.
    const item = data.message;
    if (!item) return;

    const server = client.guilds.cache.get(item.guildId);
    if (!server) return;

    const channel = server.channels.cache.get(item.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory) return;

    //* Fetch the messsage and add a reaction.
    await channel.messages.fetch(item.messageId).then(async message => {
      if (!message) return;

      await message.react(item.emoji);
    });
  },
};
