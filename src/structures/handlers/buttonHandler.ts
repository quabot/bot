import { glob } from 'glob';
import { promisify } from 'util';
import type { Client } from '@classes/discord';
import { Button } from '@typings/structures';

const PG = promisify(glob);

//* Load all buttons from the interactions/buttons folder.
export default async (client: Client) => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/interactions/buttons/*/*.js`);

  files.forEach(async file => {
    const button: Button | undefined = require(file).default;
    if (!button?.name) return;

    client.buttons.set(button.name, button);
  });
};
