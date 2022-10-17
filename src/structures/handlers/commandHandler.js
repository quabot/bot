const { promisify } = require('util');
const { glob } = require('glob');
const { getContexts } = require('./contextHandler');
const PG = promisify(glob);

const consola = require('consola');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

module.exports = async (client) => {

    CommandsList = [];
    const contextMenus = await getContexts(client);
    contextMenus.forEach(i => CommandsList.push(i));

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/commands/commands/*/*.js`)).map(async (commandFile) => {
        const command = require(commandFile);
        client.commands.set(command.data.name, command);
        CommandsList.push(command.data);
    });

    consola.success(`Successfully loaded ${CommandsList.length-contextMenus.length} commands.`);


    try {
        // return; // No commands have to be loaded.
        console.log(`Started refreshing ${CommandsList.length} commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, '922823970347180072'),
            { body: CommandsList },
        );

        console.log(`Successfully reloaded ${CommandsList.length} commands.`);
    } catch (error) {
        console.error(error);
    }
}