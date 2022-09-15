const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

let loaded = 0;
let total = 0;
let success = true;

module.exports = async (client) => {

    CommandsList = [];

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/commands/commands/*/*.js`)).map(async (commandFile) => {

        total += 1;

        const command = require(commandFile);

        if (!command.name) return success = false;
        if (!command.description) return success = false;

        client.commands.set(command.name, command);
        CommandsList.push(command);

        loaded += 1;
    });

    if (success) consola.success(`Successfully loaded ${loaded}/${total} commands.`);
    if (!success) consola.warn(`Failed to load all commands, loaded ${loaded}/${total} commands.`);

    CommandsList.sort();

    client.on('ready', async () => { client.application.commands.set(CommandsList).then(consola.info("Application commands deployed.\n")) });
}