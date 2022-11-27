import { promisify } from 'util';
import { glob } from 'glob';
import { Client } from 'discord.js';
import consola from 'consola';
import { handleError } from '../../utils/constants/errors';

const PG = promisify(glob);

let loaded = 0;
let total = 0;

module.exports = async (client: Client) => {
    (await PG(`${process.cwd().replace(/\\/g, '/')}/src/events/*/*.ts`)).map(async eventFile => {
        const event = require(eventFile);

        if (!event.event) return (total += 1);

        if (event.once)
            client.once(event.event, (...args) =>
                event.execute(...args, client).catch((e: any) => handleError(client, e, eventFile))
            );
        if (!event.once)
            client.on(event.event, (...args) =>
                event.execute(...args, client).catch((e: any) => handleError(client, e, eventFile))
            );

        loaded += 1;
        total += 1;
    });

    consola.success(`Loaded ${loaded - total !== 0 ? `${loaded}/${total}` : total} events.`);
};
