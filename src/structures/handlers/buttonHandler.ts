import { promisify } from 'util';
import { glob } from 'glob';
import type { Client } from 'discord.js';
import consola from 'consola';
import { buttons } from '../../main';

const PG = promisify(glob);
let loaded = 0;

module.exports = async (_client: Client) => {
    const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/buttons/*/*.ts`);

    files.forEach(async file => {
        const button = require(file);
        if (!button.name) return;

        buttons.set(button.name, button);
        loaded += 1;
    });

    consola.success(`Loaded ${loaded}/${files.length} buttons.`);
};
