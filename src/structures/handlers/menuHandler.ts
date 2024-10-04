import { glob } from 'glob';
import { promisify } from 'util';
import type { Client } from '@classes/discord';
import { Menu } from '@typings/structures';

const PG = promisify(glob);

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/interactions/menus/*/*.js`);

  files.forEach(async file => {
    const menu: Menu | undefined = require(file).default;
    if (!menu?.name) return;

    client.menus.set(menu.name, menu);
  });
};
