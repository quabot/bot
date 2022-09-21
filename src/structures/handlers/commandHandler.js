const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const consola = require('consola');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();

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
        if (command.permission) command.permission = parseInt(command.permission);
        if (command.permissions) command.permissions = parseInt(command.permissions) //! FIX!!
        CommandsList.push(command);

        loaded += 1;
    });

    if (success) consola.success(`Successfully loaded ${loaded}/${total} commands.`);
    if (!success) consola.warn(`Failed to load all commands, loaded ${loaded}/${total} commands.`);

    CommandsList.sort();



    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    const clientId = '995243562134409296';

    try {
        console.log(`Started refreshing ${CommandsList.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: CommandsList },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error("L Didnt work");
    }
}