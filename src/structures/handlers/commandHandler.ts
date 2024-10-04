import { glob } from 'glob';
import { promisify } from 'util';
import { type ContextMenuCommandBuilder, Routes, type SlashCommandBuilder } from 'discord.js';

import { REST } from '@discordjs/rest';
import getUserContexts from './userContextHandler';
import getMessageContexts from './messageContextHandler';
import type { Client } from '@classes/discord';
import type { Command } from '@typings/structures';
import consola from 'consola';

const PG = promisify(glob);
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

//* Load all commands from the commands folder. Create them with the user and message contexts.
export default async function (client: Client) {
  const commandsList: (SlashCommandBuilder | ContextMenuCommandBuilder)[] = [];
  const userContexts = await getUserContexts(client);
  const messageContexts = await getMessageContexts(client);
  userContexts.forEach(context => commandsList.push(context));
  messageContexts.forEach(context => commandsList.push(context));

  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/dist/commands/*/*.js`);
  files.forEach(async file => {
    const command: Command | undefined = require(file).default;
    if (!command?.data) return;

    client.commands.set(command.data.name, command);
    commandsList.push(command.data);
  });

  try {
    //* Only reload commands for the first shard.
    
    if (client.shard?.ids[0] !== 0) return;
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

    consola.success('Reloaded all commands.');
  } catch (error) {
    consola.warn(`Failed to reload commands: ${error}`);
  }
}
