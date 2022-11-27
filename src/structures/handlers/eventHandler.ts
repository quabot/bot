import { promisify } from 'util';
import { glob } from 'glob';
import type { Client } from 'discord.js';
import consola from 'consola';
import { handleError } from '../../utils/constants/errors';

const PG = promisify(glob);

let loaded = 0;

module.exports = async (client: Client) => {
    const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/events/*/*.ts`);

    files.forEach(async file => {
        const event = require(file);
        if (!event.name) return;

        if (event.once)
            client.once(event.name, (...args) =>
                event.execute(...args, client).catch((e: any) => handleError(client, e, file))
            );
        if (!event.once)
            client.on(event.name, (...args) =>
                event.execute(...args, client).catch((e: any) => handleError(client, e, file))
            );

        loaded += 1;
    });

    consola.success(`Loaded ${loaded}/${files.length} events.`);
};
