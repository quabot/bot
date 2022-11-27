import { promisify } from 'util';
import { glob } from 'glob';
import { Client } from 'discord.js';
import consola from 'consola';
import { selectors } from '../../main';

const PG = promisify(glob);
let loaded = 0;
let total = 0;

module.exports = async (client: Client) => {
    (await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/select/*/*.ts`)).map(async selectFile => {
        const select = require(selectFile);

        if (!select.id) return (total += 1);
        selectors.set(select.id, select);

        total += 1;
        loaded += 1;
    });

    consola.success(`Loaded ${loaded - total !== 0 ? `${loaded}/${total}` : total} select menus.`);
};
