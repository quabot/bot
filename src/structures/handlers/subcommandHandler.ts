import { glob } from 'glob';
import { promisify } from 'util';
import { Client } from '@classes/discord';
import { Subcommand } from '@typings/structures';

const PG = promisify(glob);

export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/subcommands/*/*/*.js`);

  files.forEach(async file => {
    const subcommand: Subcommand | undefined = require(file).default;
    if (!subcommand?.parent || !subcommand.name) return;
    
    client.subcommands.set(`${subcommand.name}/${subcommand.parent}`, subcommand);
  });
};
