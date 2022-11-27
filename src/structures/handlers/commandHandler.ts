// @ts-nocheck
import { promisify } from 'util';
import { glob } from 'glob';
import { Client, Routes } from 'discord.js';
import consola from 'consola';

import { REST } from '@discordjs/rest';
import { commands } from '../../main';

const PG = promisify(glob);
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

module.exports = async (client: Client) => {
    const commandsList = [];

    (await PG(`${process.cwd().replace(/\\/g, '/')}/src/commands/*/*.ts`)).map(async commandFile => {
        const command = require(commandFile);
        if (!command.data) return;
        commands.set(command.data.name, command);
        commandsList.push(command.data);
    });

    consola.success(`Loaded ${commandsList.length} commands.`);

    try {
        if (process.env.RELOAD_COMMANDS === 'false') return;

        if (process.env.NODE_ENV === 'development') {
            await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
                body: commandsList,
            });
        } else {
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                body: commandsList,
            });
        }

        consola.info(`Reloaded ${commandsList.length} commands.`);
    } catch (error) {
        consola.warn(`Failed to reload commands: ${error}`);
    }
};
