import { glob } from 'glob';
import { promisify } from 'util';
import consola from 'consola';
import type { Client } from '@classes/discord';

const PG = promisify(glob);
let loaded = 0;

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/menus/*/*.js`);

  files.forEach(async file => {
    //? don't have a type, cause we don't use menus yet
    const menu = await import(file);
    if (!menu.id) return;

    client.menus.set(menu.id, menu);
    loaded++;
  });

  consola.success(`Loaded ${loaded}/${files.length} select menus.`);
};
