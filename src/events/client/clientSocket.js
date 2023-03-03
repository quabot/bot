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

        const wss = new WebSocketServer({ port: 8080 });
        consola.info('Listening on port :8080');

        wss.on('connection', function connection(ws) {
          ws.on('error', console.error);
        
          ws.on('message', function message(d) {
            const data = JSON.parse(d);
            if (data.status !== 200) return;
            
            if (data.type === 'cache') client.cache.take(data.message);
          });
        });
    }
}