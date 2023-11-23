import { promisify } from 'util';
import { glob } from 'glob';
const PG = promisify(glob);
import consola from 'consola';
import { Client } from '@classes/discord';

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/ws/*/*.js`);
  files.map(async wsFile => {
    const ws = require(wsFile).default;
    if (!ws.code) return;

    client.ws_events.set(ws.code, ws);
  });

  consola.success(`Loaded ${client.ws_events.size}/${files.length} WebSocket events.`);
};
