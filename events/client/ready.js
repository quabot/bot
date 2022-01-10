const config = require('../../files/settings.json');
const discord = require('discord.js');
const dbots = require('dbots');
const consola = require('consola');
const mongoose = require('mongoose');
require('dotenv').config()


module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        consola.log(` 
${client.user.username.toUpperCase()}
Servers: ${client.guilds.cache.size}
Users: ${client.users.cache.size}
Version: ${config.VERSION}\n `);

        (function loop() {
            setTimeout(function () {
                client.user.setActivity(`${client.users.cache.size} users |  /help`, { type: "WATCHING" });
            }, 6000);

            setTimeout(function () {
                client.user.setActivity(`quabot.xyz`, { type: "WATCHING" });
            }, 12000);

            setTimeout(function () {
                client.user.setActivity(`${client.guilds.cache.size} servers |  /help`, { type: "WATCHING" });
                loop()
            }, 18000);
        }());

        const poster = new dbots.Poster({
            client,
            apiKeys: {
                discordbotlist: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6Ijg0NTYwMzcwMjIxMDk1MzI0NiIsImlhdCI6MTY0MTMwMDYwOX0.73lJeUdYcD-75lGJVuO9ha2MApZsEdxAqT78dwjC4Lk',
                topgg: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0NTYwMzcwMjIxMDk1MzI0NiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI0OTE5NDYxfQ.rC8BpVuxV4C6o9xb-KX5uh0gGZ2srpZhlG9BMwNmx-g',
                discordbotsgg: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOnRydWUsImlkIjoiNDg2NTYzNDY3ODEwMzA4MDk2IiwiaWF0IjoxNjQxMzAxMzk4fQ.inD9YUCZIsMtYfHg9NRhrfC8VOYMmhJGLlwKztAC62w'
            },
            clientLibrary: 'discord.js'
        });
        poster.startInterval();

        mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((m) => {
            consola.success("Connected to database!");
        }).catch((err) => consola.error(err));

        const Levels = require("discord.js-leveling");
        Levels.setURL(process.env.DATABASE_URL);
    }
};