import { glob } from 'glob';
import { promisify } from 'util';
import consola from 'consola';
import type { Client } from '@classes/discord';

const PG = promisify(glob);

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/interactions/menus/*/*.js`);

  files.forEach(async file => {
    //? don't have a type, cause we don't use menus yet
    const menu = require(file).default;
    if (!menu.id) return;

    client.menus.set(menu.id, menu);
  });

  consola.success(`Loaded ${client.menus.size}/${files.length} select menus.`);
};
