const { Client, Collection, Partials } = require('discord.js');
const { Channel, Reaction, Message } = Partials;

const client = new Client({ intents: 47055, partials: [Channel, Reaction, Message] });
require('dotenv').config();


client.buttons = new Collection();
client.commands = new Collection();
client.menus = new Collection();
client.modals = new Collection();
client.subcommands = new Collection();
['buttonHandler', 'commandHandler' ,'eventHandler', 'menuHandler', 'modalHandler', 'subcommandHandler'].forEach(handler => {
    require(`./structures/handlers/${handler}`)(client);
});


const NodeCache = require('node-cache');
const cache = new NodeCache();
client.cache = cache;

client.login(process.env.TOKEN);
