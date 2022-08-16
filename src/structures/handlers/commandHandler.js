const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

module.exports = async (client) => {
    const CommandsTable = new Ascii("Commands");

    CommandsList = [];

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/commands/commands/*/*.js`)).map(async (commandFile) => {

        const command = require(commandFile);

        if (!command.name) CommandsTable.addRow(commandFile.split("/")[7], "❌ - FAILED, NO NAME");
        if (!command.description) CommandsTable.addRow(commandFile.split("/")[7], "❌ - FAILED, NO DESCRIPTION");

        client.commands.set(command.name, command);
        CommandsList.push(command);

        await CommandsTable.addRow(command.name, "✅ - SUCCESS");

    });

    consola.log(CommandsTable.toString());
    
    CommandsList.sort();
    client.on('ready', async () => { client.application.commands.set(CommandsList); });
}