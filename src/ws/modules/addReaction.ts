import type { WsEventArgs } from '@typings/functionArgs';

//* Add a reaction to a message for reactionroles.
export default {
  code: 'add-reaction',
  async execute({ }: WsEventArgs) {
    // //* Get all the required variables.
    // const item = data.message;
    // if (!item) return;

    // const server = client.guilds.cache.get(item.guildId);
    // if (!server) return;

    // const channel = server.channels.cache.get(item.channelId);
    // if (!channel || channel.type === ChannelType.GuildCategory) return;

    // //* Fetch the messsage and add a reaction.
    // const message = await channel.messages.fetch(item.messageId);
    // if (!message || !('react' in message) || typeof message.react !== 'function') return;

    // await message.react(item.emoji);
  },
};
