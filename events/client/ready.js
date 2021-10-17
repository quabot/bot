const config = require('../../files/config.json');
const discord = require('discord.js');
const consola = require('consola');

module.exports = {
    name: "ready",
    once: true,
    execute(client) {

        consola.log(` \n${client.user.username.toUpperCase()}\nServers: ${client.guilds.cache.size}\nUsers: ${client.users.cache.size}\nVersion: ${config.VERSION}\n `);
        setTimeout(() => {
            consola.success("QuaBot is now fully loaded!\n ");
        }, 3000); 
        (function loop() {
            setTimeout(function () {
                client.user.setActivity(`/help to ${client.users.cache.size} users!`, { type: "STREAMING", url: "https://twitch.tv/joa_sss" });
            }, 6000);
            setTimeout(function () {
                client.user.setActivity(`/help to ${client.guilds.cache.size} servers!`, { type: "STREAMING", url: "https://twitch.tv/joa_sss" });
                loop()
            }, 12000);
          }());
    }
};