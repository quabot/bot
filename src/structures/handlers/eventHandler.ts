import { promisify } from 'util';
import { glob } from 'glob';
const PG = promisify(glob);
import type { Client } from '@classes/discord';
import type { Event } from '@typings/structures';
import type { EventArgs } from '@typings/functionArgs';

let loaded = 0;

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/events/*/*.js`);

  files.forEach(async eventFile => {
    const event: Event | undefined = require(eventFile).default;
    if (!event?.event) return;

    const defaultArgs: EventArgs = { client, color: '#416683' };

    if (event.once) {
      client.once(event.event, (...args) => event.execute(defaultArgs, ...args).catch(() => {}));
    } else {
      client.on(event.event, (...args) => event.execute(defaultArgs, ...args).catch(e => console.log(e)));
    }

    loaded++;
  });
};
