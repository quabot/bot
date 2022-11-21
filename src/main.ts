import { Client, Partials } from 'discord.js';
const { Channel, Reaction, Message } = Partials;

const client = new Client({ intents: 47055, partials: [Channel, Reaction, Message] });
require('dotenv').config();

['eventHandler'].forEach(handler => {
    require(`./structures/handlers/${handler}`)(client);
});

client.login(process.env.TOKEN);