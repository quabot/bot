import { glob } from 'glob';
import { promisify } from 'util';
import { Client } from '@classes/discord';
import consola from 'consola';
import { Modal } from '@typings/structures';

const PG = promisify(glob);
let loaded = 0;

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/modals/*/*.js`);

  files.forEach(async file => {
    const modal: Modal = await import(file);
    if (!modal.name) return;

    client.modals.set(modal.name, modal);
    loaded++;
  });

  consola.success(`Loaded ${loaded}/${files.length} modals.`);
};
