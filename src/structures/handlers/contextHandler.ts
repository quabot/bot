import { glob } from 'glob';
import { promisify } from 'util';
import consola from 'consola';
import type { Client } from '@classes/discord';
import { Context } from '@typings/discord';
import type { ContextMenuCommandBuilder } from 'discord.js';

const PG = promisify(glob);
let loaded = 0;

export default async (client: Client) => {
  const ContextList: ContextMenuCommandBuilder[] = [];

  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/context/*.js`);

  files.forEach(async file => {
    const menu = (await import(file)) as Context;
    if (!menu.data) return;

    client.contexts.set(menu.data.name, menu);
    ContextList.push(menu.data);

    loaded += 1;
  });

  consola.success(`Loaded ${loaded}/${files.length} context menus.`);

  return ContextList;
};
