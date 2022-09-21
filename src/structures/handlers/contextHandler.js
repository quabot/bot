const consola = require('consola');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();

module.exports = async (client) => {

    ContextList = [];

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/interactions/context/*.js`)).map(async (contextFile) => {
        const contextMenu = require(contextFile);;
        
        client.contexts.set(contextMenu.data.name, contextMenu);
        ContextList.push(contextMenu.data);
    });

    consola.success(`Successfully loaded ${ContextList.length} context menus.`);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    const clientId = process.env.CLIENT_ID;
    const guildId = "927613222452858900";

    try {
        return;
        console.log(`Started refreshing ${ContextList.length} context menus.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: ContextList },
        );

        console.log(`Successfully reloaded ${data.length} context menus.`);
    } catch (error) {
        console.error(error);
    }
}