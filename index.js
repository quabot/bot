const { Client, Collection, Partials } = require('discord.js');
const client = new Client({ intents: 3258319, partials: [Partials.Channel, Partials.Reaction, Partials.Message] });
require('dotenv').config();

/** Load dependencies for handlers. */
const { promisify } = require('util');
const { glob } = require("glob");
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

/** Create the collections for the handlers. */
client.buttons = new Collection();
client.commands = new Collection();
client.menus = new Collection();
client.modals = new Collection();
client.subcommands = new Collection();

/** Pass the dependencies to the handlers. */
['buttons', 'commands', 'events', 'subcommands', 'modals', 'menus'].forEach(handler => {
    require(`./structures/handlers/${handler}`)(client, PG, Ascii, consola);
});

client.login(process.env.TOKEN);
