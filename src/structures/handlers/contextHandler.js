const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const consola = require('consola');
const { REST } = require('@discordjs/rest');
const { Routes, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
require('dotenv').config();

let loaded = 0;
let total = 0;
let success = true;

module.exports = async (client) => {

    ContextList = [];

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/interactions/context/*.js`)).map(async (contextFile) => {

        total += 1;

        const contextMenu = require(contextFile);

        if (!contextMenu.type) return success = false;
        if (!contextMenu.name) return success = false;

        client.contexts.set(contextMenu.name, contextMenu);
        ContextList.push(contextMenu);

        loaded += 1;
    });

    if (success) consola.success(`Successfully loaded ${loaded}/${total} context menus.`);
    if (!success) consola.warn(`Failed to load all menus, loaded ${loaded}/${total} context menus.`);

    ContextList.sort();


    const ContextMenus = [];
    ContextList.forEach(menu => {
        const contextMenu = new ContextMenuCommandBuilder()
        .setName(menu.name)
        .setType(menu.type);

        ContextMenus.push(contextMenu);
    });

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    const clientId = '995243562134409296';

    try {
        console.log(`Started refreshing ${ContextMenus.length} context menus.`);

        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: ContextMenus },
        );

        console.log(`Successfully reloaded ${data.length} context menus.`);
    } catch (error) {
        console.error(error);
    }
}