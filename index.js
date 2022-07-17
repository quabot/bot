const { Client, Collection } = require('discord.js');
const client = new Client({ intents: 14287, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
require('dotenv').config();

const { promisify } = require('util');
const { glob } = require("glob");
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

client.buttons = new Collection();
client.commands = new Collection();
client.modals = new Collection();
client.subcommands = new Collection();
['buttons', 'commands', 'events', 'subcommands', 'modals'].forEach(handler => {
    require(`./structures/handlers/${handler}`)(client, PG, Ascii, consola);
});

let messageArray = [];
module.exports = { messageArray }

client.login(process.env.TOKEN);
