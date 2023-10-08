import { glob } from 'glob';
import { promisify } from 'util';
import consola from 'consola';
import type { Client } from '@classes/discord';
import { Button } from '@typings/structures';

const PG = promisify(glob);
let loaded = 0;

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/buttons/*/*.js`);

  files.forEach(async file => {
    const button: Button = await import(file);
    if (!button.name) return;

    client.buttons.set(button.name, button);
    loaded++;
  });

  consola.success(`Loaded ${loaded}/${files.length} buttons.`);
};
