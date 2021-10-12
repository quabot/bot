const fs = require('fs');
const Discord = require('discord.js');
const consola = require('consola');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });

module.exports = (client, Discord) => {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}