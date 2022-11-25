import { promisify } from 'util';
import { glob } from 'glob';
import { Client } from 'discord.js';
import consola from 'consola';
import { subcommands } from '../../main';

const PG = promisify(glob);

let total = 0;
let loaded = 0;

module.exports = async (client: Client) => {

    (await PG(`${process.cwd().replace(/\\/g, '/')}/src/subcommands/*/*.ts`)).map(async subcommandFile => {
        const subcommand = require(subcommandFile);

        if (!subcommand.command) return total +=1;
        if (!subcommand.subcommand) return total +=1;

        subcommands.set(`${subcommand.subcommand}/${subcommand.command}`, subcommand);

        total +=1;
        loaded +=1;
    });

    consola.success(`Loaded ${(loaded - total !== 0) ? `${loaded}/${total}` : total} subcommands.`);
}