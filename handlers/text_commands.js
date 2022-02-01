const Discord = require('discord.js');
const consola = require('consola');
const fs = require('fs');
const { promisify } = require('util');
const { glob } = require("glob");
const Ascii = require('ascii-table');
const PG = promisify(glob);

module.exports = async (client) => {
    const commandFolders = fs.readdirSync('./commands/');
    const Table = new Ascii("Economy Commands loaded");

    (await PG(`${process.cwd()}/Commands/economy/*.js`)).map(async (file) => {
        const command = require(file);

        if (!command.name)
            return Table.addRow(file.split("/")[7], "❌ FAILED", "Missing a name.");
        if (!command.aliases)
        return Table.addRow(file.split("/")[7], "❌ FAILED", "Missing an alias.");

        client.commands.set(command.name, command)

        await Table.addRow(command.name, "✅SUCCESFULL");
    });
    consola.log(Table.toString());
}