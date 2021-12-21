const config = require('../../files/config.json');
const discord = require('discord.js');
const consola = require('consola');

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        consola.log(` \n${client.user.username.toUpperCase()}\nServers: ${client.guilds.cache.size}\nUsers: ${client.users.cache.size}\nVersion: ${config.VERSION}\n `);
        setTimeout(() => {
            consola.success(`${client.user.username}`);
        }, 3000); 
        (function loop() {
            setTimeout(function () {
                client.user.setActivity(`${client.users.cache.size} users |  /help`, { type: "WATCHING" });
            }, 6000);
            setTimeout(function () {
                client.user.setActivity(`quabot.xyz`, { type: "WATCHING" });
            }, 5000);
            setTimeout(function () {
                client.user.setActivity(`${client.guilds.cache.size} servers |  /help`, { type: "WATCHING" });
                loop()
            }, 18000);
          }());
    }
};