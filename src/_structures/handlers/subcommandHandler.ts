import { promisify } from 'util';
import { glob } from 'glob';
import type { Client } from 'discord.js';
import consola from 'consola';
import { subcommands } from '../..';

const PG = promisify(glob);

let loaded = 0;

module.exports = async (_client: Client) => {
    const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/subcommands/*/*.ts`);

    files.forEach(async file => {
        const subcommand = require(file);
        if (!subcommand.parent || !subcommand.name) return;

        subcommands.set(`${subcommand.name}/${subcommand.parent}`, subcommand);

        loaded += 1;
    });

    consola.success(`Loaded ${loaded}/${files.length} subcommands.`);
};
