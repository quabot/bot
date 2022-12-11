import { Client } from './structures';
import { Partials } from 'discord.js';
const { Channel, Reaction, Message } = Partials;

const client = new Client({ intents: 47055, partials: [Channel, Reaction, Message] });

client.build();
