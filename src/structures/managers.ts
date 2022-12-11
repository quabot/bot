import { REST, Routes, Collection, Colors, type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { promisify } from 'util';
import { glob } from 'glob';
import consola from 'consola';
import {
    type Client,
    type Command,
    type CommandArgs,
    type Subcommand,
    type Event,
    type Modal,
    type ModalArgs,
    type SelectMenu,
    type SelectMenuArgs,
    Embed,
} from '.';

const PG = promisify(glob);

export interface BaseManager {
    client: Client;
}

export class BaseManager {
    constructor(client: Client) {
        this.client = client;
    }
}

export interface CommandManager {
    commands: Collection<string, Command>;
    commandsJSON: RESTPostAPIChatInputApplicationCommandsJSONBody[];
}

export class CommandManager extends BaseManager {
    constructor(client: Client) {
        super(client);

        this.commands = new Collection();
        this.commandsJSON = [];
    }

    async loadAll() {
        const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/commands/*/*.ts`);

        for (const file of files) {
            const command: Command = require(file).default;

            this.commands.set(command.name, command);
            this.commandsJSON.push(command.toJSON());
        }

        consola.success(`Loaded ${files.length} commands.`);

        if (process.env.RELOAD_COMMANDS === 'true') this.deployAll();

        return this;
    }

    async deployAll() {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN ?? '');

        if (process.env.NODE_ENV === 'development') {
            await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID ?? '', process.env.GUILD_ID ?? ''), {
                body: this.commandsJSON,
            });
        } else {
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID ?? ''), {
                body: this.commandsJSON,
            });
        }

        consola.info(`Reloaded all commands.`);

        return this;
    }

    async execute({ interaction, client, color }: CommandArgs) {
        const { commandName } = interaction;
        const command = this.commands.get(commandName);

        if (!command)
            return await interaction.reply({
                embeds: [
                    new Embed(Colors.Red).setDescription(
                        `⚠️ An error occurred! Couldn't find the command ${commandName}!`
                    ),
                ],
            });

        if (command.ephemeral !== 'children' && command.deferReply)
            await interaction.deferReply({ ephemeral: command.ephemeral });

        await command.callback({ interaction, client, color });

        return this;
    }
}

export interface SubcommandManager {
    subcommands: Collection<string, Subcommand>;
}

export class SubcommandManager extends BaseManager {
    constructor(client: Client) {
        super(client);

        this.subcommands = new Collection();
    }

    async loadAll() {
        const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/subcommands/*/*.ts`);

        for (const file of files) {
            const subcommand: Subcommand = require(file).default;

            this.subcommands.set(`${subcommand.parent}_${subcommand.name}`, subcommand);
        }

        consola.success(`Loaded ${files.length} subcommands.`);

        return this;
    }

    async execute({ interaction, client, color }: CommandArgs) {
        const { commandName } = interaction;
        const subcommandName = interaction.options.getSubcommand();
        const subcommand = this.subcommands.get(`${commandName}_${subcommandName}`);

        if (!subcommand)
            return await interaction.reply({
                embeds: [
                    new Embed(Colors.Red).setDescription(
                        `⚠️ An error occurred! Couldn't find the subcommand ${subcommandName} from the command ${commandName}!`
                    ),
                ],
            });

        setTimeout(async () => {
            if (!interaction.deferred && subcommand.deferReply)
                await interaction.deferReply({ ephemeral: subcommand.ephemeral });
            await subcommand.callback({ interaction, client, color });
            return this;
        }, 100);
    }
}

export interface ModalManager {
    modals: Collection<string, Modal>;
}

export class ModalManager extends BaseManager {
    constructor(client: Client) {
        super(client);

        this.modals = new Collection();
    }

    async loadAll() {
        const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/modals/*/*.ts`);

        for (const file of files) {
            const modal: Modal = require(file).default;

            this.modals.set(modal.name, modal);
        }

        consola.success(`Loaded ${files.length} modals.`);

        return this;
    }

    async execute({ interaction, client, color }: ModalArgs) {
        const { customId } = interaction;
        const modal = this.modals.get(customId);

        if (!modal)
            return await interaction.reply({
                embeds: [
                    new Embed(Colors.Red).setDescription(`⚠️ An error occurred! Couldn't find the modal ${customId}!`),
                ],
            });

        if (modal.deferReply) await interaction.deferReply({ ephemeral: modal.ephemeral });

        await modal.callback({ interaction, client, color });

        return this;
    }
}

export interface SelectMenuManager {
    selectMenus: Collection<string, SelectMenu>;
}

export class SelectMenuManager extends BaseManager {
    constructor(client: Client) {
        super(client);

        this.selectMenus = new Collection();
    }

    async loadAll() {
        const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/selectMenus/*/*.ts`);

        for (const file of files) {
            const selectMenu: SelectMenu = require(file).default;

            this.selectMenus.set(selectMenu.name, selectMenu);
        }

        consola.success(`Loaded ${files.length} selectMenus.`);

        return this;
    }

    async execute({ interaction, client, color }: SelectMenuArgs) {
        const { customId } = interaction;
        const selectMenu = this.selectMenus.get(customId);

        if (!selectMenu)
            return await interaction.reply({
                embeds: [
                    new Embed(Colors.Red).setDescription(
                        `⚠️ An error occurred! Couldn't find the selectMenu ${customId}!`
                    ),
                ],
            });

        await interaction.deferReply({ ephemeral: selectMenu.ephemeral });

        await selectMenu.callback({ interaction, client, color });

        return this;
    }
}

export class EventManager extends BaseManager {
    async loadAll() {
        const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/events/*/*.ts`);

        for (const file of files) {
            const event: Event = require(file).default;

            if (event.once) {
                this.client.once(event.name, async (...args) => await event.callback(...args, this.client));
            } else {
                this.client.on(event.name, async (...args) => await event.callback(...args, this.client));
            }
        }

        consola.success(`Loaded ${files.length} commands.`);

        return this;
    }
}
