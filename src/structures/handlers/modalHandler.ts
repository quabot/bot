import { promisify } from 'util';
import { glob } from 'glob';
import type { Client } from 'discord.js';
import consola from 'consola';
import { modals } from '../..';

const PG = promisify(glob);
let loaded = 0;

module.exports = async (_client: Client) => {
    const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/modals/*/*.ts`);

    files.forEach(async file => {
        const modal = require(file);
        if (!modal.name) return;

        modals.set(modal.name, modal);
        loaded += 1;
    });

    consola.success(`Loaded ${loaded}/${files.length} modals.`);
};
