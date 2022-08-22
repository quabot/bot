const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');
const { ContextMenuCommandBuilder, ApplicationCommandType, REST, Routes } = require('discord.js');
require('dotenv').config();

module.exports = async (client) => {
    const ContextTable = new Ascii("Context Commands");

    ContextList = [];

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/interactions/context/*.js`)).map(async (contextFile) => {

        const context = require(contextFile);

        if (!context.name) ContextTable.addRow(commandFile.split("/")[7], "❌ - FAILED, NO NAME");
        if (!context.type) ContextTable.addRow(commandFile.split("/")[7], "❌ - FAILED, NO TYPE");

        client.contexts.set(context.name, context);
        ContextList.push(context);

        await ContextTable.addRow(context.name, "✅ - SUCCESS");

    });

    consola.log(ContextTable.toString());

    ContextList.sort();

    client.on('ready', async () => {
        const menus = [];
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        ContextList.forEach(context => {
            console.log(context)
            const data = new ContextMenuCommandBuilder()
                .setName(context.name)
                .setType(context.type);
            menus.push(data.toJSON());
        });

        await rest.put(
            Routes.applicationGuildCommands(client.user.id, "1007810461347086357"),
            { body: menus },
        ).catch((e => console.log("Error with the context creation: " + e)));
    });
}