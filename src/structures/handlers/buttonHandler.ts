import { glob } from 'glob';
import { promisify } from 'util';
import consola from 'consola';
import type { Client } from '@classes/discord';
import { Button } from '@typings/structures';

const PG = promisify(glob);

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/interactions/buttons/*/*.js`);

  files.forEach(async file => {
    const button: Button | undefined = require(file).default;
    if (!button?.name) return;

    client.buttons.set(button.name, button);
  });

  consola.success(`Loaded ${client.buttons.size}/${files.length} buttons.`);
};
