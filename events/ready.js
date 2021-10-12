const config = require('../files/config.json');
const discord = require('discord.js');
const consola = require('consola')

module.exports = {
    name: 'ready',
    once: true,
    execute(client, message, args) {

        // STARTUP MESSAGE
        consola.log(` \nClient: ${client.user.tag}\nChannels: ${client.channels.cache.size}\nServers: ${client.guilds.cache.size}\nUsers: ${client.users.cache.size}\nVersion: ${config.VERSION}\n `);

        setTimeout(() => {
            consola.info("Loading commands: Succes!");
            consola.info("Loading events: Succes!");
            consola.success("QuaBot is now fully loaded!");
        }, 1000);

        // STATUS
        client.user.setActivity(`${config.PREFIX}help`, { type: "PLAYING" });
    }
}