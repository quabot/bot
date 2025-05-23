import { glob } from 'glob';
import { promisify } from 'util';
import { Client } from '@classes/discord';
import consola from 'consola';
import { Modal } from '@typings/structures';

const PG = promisify(glob);

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/interactions/modals/*/*.js`);

  files.forEach(async file => {
    const modal: Modal | undefined = require(file).default;
    if (!modal?.name) return;

    client.modals.set(modal.name, modal);
  });

  consola.success(`Loaded ${client.modals.size}/${files.length} modals.`);
};
