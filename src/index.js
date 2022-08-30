const { Client, Collection } = require('discord.js');

const client = new Client({ intents: 46799 });
require('dotenv').config();

client.buttons = new Collection();
client.commands = new Collection();
// client.contexts = new Collection();
client.modals = new Collection();
client.subcommands = new Collection();
['buttonHandler', 'contextHandler', 'commandHandler', 'eventHandler', 'modalHandler', 'subcommandHandler'].forEach(handler => {
    require(`./structures/handlers/${handler}`)(client);
});

const NodeCache = require('node-cache');
const cache = new NodeCache();
client.cache = cache;

client.login(process.env.TOKEN);