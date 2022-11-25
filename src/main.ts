import { Client, Collection, Partials } from 'discord.js';
const { Channel, Reaction, Message } = Partials;

const client = new Client({ intents: 47055, partials: [Channel, Reaction, Message] });
require('dotenv').config();

export const commands = new Collection();
export const subcommands = new Collection();
['commandHandler', 'subcommandHandler', 'eventHandler'].forEach(handler => {
    require(`./structures/handlers/${handler}`)(client);
});

import NodeCache from 'node-cache';
export const cache = new NodeCache();

client.login(process.env.TOKEN);