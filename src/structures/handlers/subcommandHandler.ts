import { glob } from 'glob';
import { promisify } from 'util';
import { Client } from '@classes/discord';
import consola from 'consola';
import { Subcommand } from '@typings/structures';

const PG = promisify(glob);
let loaded = 0;

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/subcommands/*/*/*.js`);
  files.forEach(async file => {
    const subcommand: Subcommand = await import(file);
    if (!subcommand.parent || !subcommand.name) return;

    client.subcommands.set(`${subcommand.name}/${subcommand.parent}`, subcommand);

    loaded++;
  });

  consola.success(`Loaded ${loaded}/${files.length} subcommands.`);
};
