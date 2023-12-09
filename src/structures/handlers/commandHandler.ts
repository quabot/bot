import { glob } from 'glob';
import { promisify } from 'util';
import { type ContextMenuCommandBuilder, Routes, type SlashCommandBuilder } from 'discord.js';
import consola from 'consola';

import { REST } from '@discordjs/rest';
import getContexts from './contextHandler';
import type { Client } from '@classes/discord';
import type { Command } from '@typings/structures';

const PG = promisify(glob);
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

export default async function (client: Client) {
  const commandsList: (SlashCommandBuilder | ContextMenuCommandBuilder)[] = [];
  const contexts = await getContexts(client);
  contexts.forEach(context => commandsList.push(context));

  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/commands/*/*.js`);
  files.forEach(async file => {
    const command: Command | undefined = require(file).default;
    if (!command?.data) return;

    client.commands.set(command.data.name, command);
    commandsList.push(command.data);
  });

  consola.success(`Loaded ${client.commands.size}/${files.length} commands.`);

  try {
    if (process.env.RELOAD_COMMANDS === 'false') return;

    if (process.env.NODE_ENV === 'development') {
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!), {
        body: commandsList,
      });
    } else {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
        body: commandsList,
      });
    }

    consola.info('Reloaded all commands.');
  } catch (error) {
    consola.warn(`Failed to reload commands: ${error}`);
  }
}
