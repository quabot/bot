import { promisify } from 'util';
import { glob } from 'glob';
import type { Client } from 'discord.js';
import consola from 'consola';
import { selectors } from '../../main';

const PG = promisify(glob);
let loaded = 0;

module.exports = async (_client: Client) => {
    const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/select/*/*.ts`);

    files.forEach(async file => {
        const select = require(file);
        if (!select.name) return;

        selectors.set(select.name, select);
        loaded += 1;
    });

    consola.success(`Loaded ${loaded}/${files.length} select menus.`);
};
