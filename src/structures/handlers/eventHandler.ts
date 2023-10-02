import { promisify } from 'util';
import { glob } from 'glob';
const PG = promisify(glob);
import consola from 'consola';
import type { Client } from '@classes/discord';
import type { Event } from '@typings/structures';
import type { EventArgs } from '@typings/functionArgs';

let loaded = 0;
let total = 0;

export default async (client: Client) => {
  (await PG(`${process.cwd().replace(/\\/g, '/')}/src/events/*/*.js`)).map(async eventFile => {
    total += 1;

    const event: Event = await import(eventFile);
    if (!event.name || !event.event) return;

    const defaultArgs: EventArgs = { client, color: '#416683' };

    if (event.once) {
      client.once(event.event, (...args) => event.execute(defaultArgs, ...args).catch(() => {}));
    } else {
      client.on(event.event, (...args) => event.execute(defaultArgs, ...args).catch(e => console.log(e)));
    }

    loaded += 1;
  });

  consola.success(`Loaded ${loaded}/${total} events.`);
};
