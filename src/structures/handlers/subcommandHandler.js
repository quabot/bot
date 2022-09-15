const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

let loaded = 0;
let total = 0;
let success = true;

module.exports = async (client) => {

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/commands/subcommands/*/*.js`)).map(async (subcommandFile) => {
        total += 1;

        const subcommand = require(subcommandFile);

        if (!subcommand.name) return success = false;
        if (!subcommand.command) return success = false;

        client.subcommands.set(`${subcommand.name}/${subcommand.command}`, subcommand);

        loaded += 1;
    });

    if (success) consola.success(`Successfully loaded ${loaded}/${total} subcommands.`);
    if (!success) consola.warn(`Failed to load all subcommands, loaded ${loaded}/${total} subcommands.`);
}