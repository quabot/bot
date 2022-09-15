const { Client } = require('discord.js');
const consola = require('consola');
require('dotenv').config();

module.exports = {
    event: "ready",
    name: "clientConnections",
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {

        const { io } = require("socket.io-client");
        const socket = io("http://localhost:3002");
        socket.on("connect", () => {
            consola.info("Websocket connected.");

            const engine = socket.io.engine;
            engine.on("packet", ({ type, data }) => {
                if (type !== 'message') return;
                const index = data.indexOf(",");
                const sliced = data.slice(index, data.length);
                const cache = sliced.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/['"]+/g, '');

                client.cache.take(cache);
            });
        });

        socket.on("disconnect", () => {
            consola.warn("Websocket disconnected.");
        });
    }
}