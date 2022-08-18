const { Client, Collection } = require('discord.js');

const client = new Client({ intents: 46799 });
require('dotenv').config();

client.commands = new Collection();
client.subcommands = new Collection();
['commandHandler', 'eventHandler', 'subcommandHandler'].forEach(handler => {
    require(`./structures/handlers/${handler}`)(client);
});

const NodeCache = require('node-cache');
const cache = new NodeCache();
client.cache = cache;

client.login(process.env.TOKEN);