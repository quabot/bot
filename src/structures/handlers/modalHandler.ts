import { promisify } from 'util';
import { glob } from 'glob';
import { Client } from 'discord.js';
import consola from 'consola';
import { modals } from '../../main';

const PG = promisify(glob);
let loaded = 0;
let total = 0;

module.exports = async (client: Client) => {
    (await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/modals/*/*.ts`)).map(async modalFile => {
        const modal = require(modalFile);

        if (!modal.id) return (total += 1);
        modals.set(modal.id, modal);

        total += 1;
        loaded += 1;
    });

    consola.success(`Loaded ${loaded - total !== 0 ? `${loaded}/${total}` : total} modals.`);
};
