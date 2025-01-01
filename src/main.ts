import { Client } from '@classes/discord';
import { ActivityType, Collection, Partials } from 'discord.js';
const { Channel, Reaction, Message } = Partials;

//* Configuring a timeout for the undici agent, used for the HTTP requests (needed for production).
import { setGlobalDispatcher, Agent } from 'undici';
setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }));

//* Create the client & set intents and partials.
const client = new Client({
  intents: 46847,
  partials: [Channel, Reaction, Message],
});

//* Define the collections that will store different types of events/interactions and the websocket events.
client.buttons = new Collection();
client.commands = new Collection();
client.userContexts = new Collection();
client.messageContexts = new Collection();
client.menus = new Collection();
client.modals = new Collection();
client.ws_events = new Collection();
client.subcommands = new Collection();
client.custom_commands = [];

// //* Call the handlers for each type of event/interaction and start them.
// [
//   'buttonHandler',
//   'commandHandler',
//   'eventHandler',
//   'menuHandler',
//   'modalHandler',
//   'subcommandHandler',
//   'wsHandler',
// ].forEach(handler => {
//   require(`./structures/handlers/${handler}`).default(client);
// });

client.on('ready', (client: any) => {
  console.info(
    'QuaBot has stopped operation. We recommend switching to ProBot (https://probot.io). We are sorry for the inconvenience. Thank you for 3 amazing years of operations.',
  );

  client.user?.setPresence({ status: 'invisible' });
  client.user?.setActivity({
    type: ActivityType.Watching,
    name: 'thank you for 3 years of operation',
    state: 'QuaBot has been shut down.',
  });
});

client.on('interactionCreate', async (interaction: any) => {
  return await interaction
    .reply({
      content:
        'As of January 1, 2025, QuaBot has stopped operation. We recommend switching to [ProBot](https://probot.io). We are sorry for the inconvenience. Thank you for 3 amazing years of operations.',
      ephemeral: true,
    })
    .catch(() => null);
});

//* Setup the Client's cache.
import NodeCache from 'node-cache';
client.cache = new NodeCache();

//* Login to Discord.
client.login(process.env.TOKEN);
