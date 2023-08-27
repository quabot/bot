//* Add a reaction to a message for reactionroles.
module.exports = {
  code: "add-reaction",
  async execute(client, data) {
    //* Get all the required variables.
    const item = data.message;
    if (!item) return;

    const server = client.guilds.cache.get(item.guildId);
    if (!server) return;

    const channel = server.channels.cache.get(item.channelId);
    if (!channel) return;

    //* Fetch the messsage and add a reaction.
    await channel.messages.fetch(item.messageId).then(async (message) => {
      if (!message) return;
      await message.react(item.emoji);
    });
  },
};
