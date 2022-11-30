import { promisify } from 'util';
import { glob } from 'glob';
import { type Client, Routes, type SlashCommandBuilder } from 'discord.js';
import consola from 'consola';

import { REST } from '@discordjs/rest';
import { commands } from '../..';

const PG = promisify(glob);
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN ?? '');

module.exports = async (_client: Client) => {
    const commandsList: SlashCommandBuilder[] = [];

    const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/commands/*/*.ts`);

    files.forEach(async file => {
        const command = require(file);
        if (!command.data) return;

        commands.set(command.data.name, command);
        commandsList.push(command.data);
    });

    consola.success(`Loaded ${commandsList.length}/${files.length} commands.`);

    try {
        if (process.env.RELOAD_COMMANDS === 'false') return;

        if (process.env.NODE_ENV === 'development') {
            await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID ?? '', process.env.GUILD_ID ?? ''), {
                body: commandsList,
            });
        } else {
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID ?? ''), {
                body: commandsList,
            });
        }

        consola.info(`Reloaded all commands.`);
    } catch (error) {
        consola.warn(`Failed to reload commands: ${error}`);
    }
};
