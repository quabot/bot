import { glob } from 'glob';
import { promisify } from 'util';
import consola from 'consola';
import type { Client } from '@classes/discord';
import type { ContextMenuCommandBuilder } from 'discord.js';
import { UserContext } from '@typings/structures';

const PG = promisify(glob);

export default async function (client: Client) {
  const ContextList: ContextMenuCommandBuilder[] = [];

  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/interactions/context/user/*.js`);

  files.forEach(async file => {
    const menu:UserContext | undefined = require(file).default;
    if (!menu?.data) return;

    client.userContexts.set(menu.data.name, menu);
    ContextList.push(menu.data);
  });

  consola.success(`Loaded ${client.userContexts.size}/${files.length} user context menus.`);

  return ContextList;
}
