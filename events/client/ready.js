const consola = require('consola');
const { connect } = require('mongoose');
const { setURL } = require("discord.js-leveling");
const { VERSION } = require('../../files/settings.json');
require('dotenv').config();

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        consola.log(`\n${client.user.username.toUpperCase()}#${client.user.discriminator}\nServers: ${client.guilds.cache.size}\nUsers: ${client.users.cache.size}\nChannels: ${client.channels.cache.size}\nVersion: ${VERSION}`);

        connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).catch((err) => consola.error(err));
        setURL(process.env.DATABASE_URL);

        (function loop() {
            setTimeout(function () {
                client.user.setActivity(`${client.users.cache.size} users |  /help`, { type: "WATCHING" });
            }, 6000);

            setTimeout(function () {
                client.user.setActivity(`quabot.net | /help`, { type: "WATCHING" });
            }, 12000);

            setTimeout(function () {
                client.user.setActivity(`${client.guilds.cache.size} servers |  /help`, { type: "WATCHING" });
                loop()
            }, 18000);
        }());
    }
}