import { promisify } from 'util';
import { glob } from 'glob';
const PG = promisify(glob);
import consola from 'consola';
import { Client } from '@classes/discord';

let loaded = 0;

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/ws/*/*.js`);
  files.map(async wsFile => {
    const ws = await import(wsFile);
    if (!ws.code) return;

    client.ws_events.set(ws.code, ws);

    loaded++;
  });

  consola.success(`Loaded ${loaded}/${files.length} WebSocket events.`);
};
