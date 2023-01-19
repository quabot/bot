const { Client, Collection, Partials } = require('discord.js');
const { Channel, Reaction, Message } = Partials;

const client = new Client({ intents: 47055, partials: [Channel, Reaction, Message] });
require('dotenv').config();


['eventHandler'].forEach(handler => {
    require(`./structures/handlers/${handler}`)(client);
});


const NodeCache = require('node-cache');
const cache = new NodeCache();
client.cache = cache;

client.login(process.env.TOKEN);
