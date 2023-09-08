import('module-alias/register');

import { Client } from '@classes/discord';
import { Collection, Partials } from 'discord.js';
const { Channel, Reaction, Message } = Partials;

//* Create the client & set intents and partials.
const client = new Client({
  intents: 46847,
  partials: [Channel, Reaction, Message],
});

//* Define the collections that will store different types of events/interactions and the websocket events.
client.buttons = new Collection();
client.commands = new Collection();
client.contexts = new Collection();
client.menus = new Collection();
client.modals = new Collection();
client.ws_events = new Collection();
client.subcommands = new Collection();
client.custom_commands = [];

//* Call the handlers for each type of event/interaction and start them.
[
  'buttonHandler',
  'commandHandler',
  'eventHandler',
  'menuHandler',
  'modalHandler',
  'subcommandHandler',
  'wsHandler',
].forEach(handler => {
  require(`./structures/handlers/${handler}`)(client);
});

//* Setup the Client's cache.
import NodeCache from 'node-cache';
client.cache = new NodeCache();

//* Login to Discord.
client.login(process.env.TOKEN);
