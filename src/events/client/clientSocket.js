const { Client } = require('discord.js');
const { WebSocketServer } = require('ws');
const consola = require('consola');
const { CustomEmbed } = require('../../utils/constants/customEmbed');

module.exports = {
  event: "ready",
  name: "clientSocket",
  once: true,
  /**
   * @param {Client} client 
   */
  async execute(client) {

    const wss = new WebSocketServer({ port: 8080 });
    consola.info('Listening on port :8080');

    wss.on('connection', function connection(ws) {
      ws.on('error', console.error);

      ws.on('message', async function message(d) {
        const data = JSON.parse(d);
        if (data.status !== 200) return;

        if (data.type === 'cache') client.cache.take(data.message);

        if (data.type === 'send-message') {
          const guild = client.guilds.cache.get(data.guildId);
          if (!guild) return;
          const channel = guild.channels.cache.get(data.channelId);
          if (!channel) return;


          const getParsedString = (s) => {
            return `${s}`.replaceAll(`{guild}`, guild.name).replaceAll(`{members}`, guild.memberCount);
          }

          const sentEmbed = new CustomEmbed(data.message, getParsedString);

          await channel.send({ embeds: [sentEmbed], content: getParsedString(data.message.content) ?? '' })
        }

        if (data.type === 'add-reaction') {
          const item = data.message;
          if (!item) return;

          const server = client.guilds.cache.get(item.guildId);
          if (!server) return;

          const channel = server.channels.cache.get(item.channelId);
          if (!channel) return;

          await channel.messages
            .fetch(item.messageId)
            .then(async (message) => {
              if (!message) return;
              await message.react(item.emoji);
            });
        }
      });
    });
  }
}