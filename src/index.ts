import { Client } from './structures';
import { Partials } from 'discord.js';
import { handleError } from './utils';
import consola from 'consola';
const { Channel, Reaction, Message } = Partials;

const client = new Client({ intents: 47055, partials: [Channel, Reaction, Message] });

process.setUncaughtExceptionCaptureCallback(async error => {
    try {
        await handleError(client, error);
    } catch (error) {
        consola.error(error);
    }
});

client.build();
