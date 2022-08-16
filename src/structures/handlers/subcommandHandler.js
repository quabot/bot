const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

module.exports = async (client) => {
    const SubcmdsTable = new Ascii("Subcommands");

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/commands/subcommands/*/*.js`)).map(async (subcommandFile) => {

        const subcommand = require(subcommandFile);

        if (!subcommand.name) SubcmdsTable.addRow(subcommandFile.split("/")[7], "❌ - FAILED, NO NAME");
        if (!subcommand.command) SubcmdsTable.addRow(subcommandFile.split("/")[7], "❌ - FAILED, NO COMMAND");

        client.subcommands.set(`${subcommand.name}/${subcommand.command}`, subcommand);
        await SubcmdsTable.addRow(`${subcommand.command}/${subcommand.name}`, "✅ - SUCCESS");

    });

    consola.log(SubcmdsTable.toString());
}