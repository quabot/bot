const { Client, Collection } = require('discord.js');
const client = new Client({ intents: 32767 });
require('dotenv').config();

const { promisify } = require('util');
const { glob } = require("glob");
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

const discord = require('discord.js');
client.commands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();
['commands', 'buttons', 'events', 'menus'].forEach(handler => {
    require(`./structures/handlers/${handler}`)(client, PG, Ascii, consola);
});

client.login(process.env.TOKEN);