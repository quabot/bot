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
        });

        socket.on("update", (data) => {
            client.cache.take(data.cache);
        });

        socket.on("disconnect", () => {
            consola.warn("Websocket disconnected.");
        });
    }
}