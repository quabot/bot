const { Client } = require('discord.js');
const { WebSocketServer } = require('ws');
const consola = require('consola');

module.exports = {
  event: "ready",
  name: "clientSocket",
  once: true,
  /**
   * @param {Client} client 
   */
  async execute(client) {

    const wss = new WebSocketServer({ port: 8081 });
    consola.info('Listening on port :8081');

    wss.on('connection', function connection(ws) {
      ws.on('error', console.error);

      ws.on('message', async function message(d) {
        const data = JSON.parse(d);
        if (data.status !== 200) return;
        
        const ws = client.ws_events.get(data.type);
        if (!ws) return consola.warn('Unhandled WebSocket event: ' + data.type + '.');

        ws.execute(client, data).catch((e) => consola.error('WebSocket error:' + e));
      });
    });
  }
}