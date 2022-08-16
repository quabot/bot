const consola = require('consola');
const { Client, ActivityType } = require('discord.js');

module.exports = {
    event: "ready",
    name: "clientStart",
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        consola.success(`Logged in as ${client.user.tag}!`);

        client.user.setActivity({
            type: ActivityType.Watching,
            name: "QuaBot v1"
        });
    }
}