import { glob } from 'glob';
import { promisify } from 'util';
import consola from 'consola';
import type { Client } from '@classes/discord';
import type { Context } from '@typings/structures';
import type { ContextMenuCommandBuilder } from 'discord.js';

const PG = promisify(glob);

export default async function (client: Client) {
  const ContextList: ContextMenuCommandBuilder[] = [];

  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/interactions/context/*.js`);

  files.forEach(async file => {
    const menu: Context = require(file).default;
    if (!menu.data) return;

    client.contexts.set(menu.data.name, menu);
    ContextList.push(menu.data);
  });

  consola.success(`Loaded ${client.contexts.size}/${files.length} context menus.`);

  return ContextList;
}
