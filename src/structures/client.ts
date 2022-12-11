import { Client as BaseClient, type ClientOptions } from 'discord.js';
import { CommandManager, SubcommandManager, ModalManager, SelectMenuManager, EventManager } from '.';

export interface ClientConfig {
    token: string;
    guildId: string;
}

export interface Client {
    config: ClientConfig;
    commands: CommandManager;
    subcommands: SubcommandManager;
    modals: ModalManager;
    selectMenus: SelectMenuManager;
    events: EventManager;
}

export class Client extends BaseClient {
    constructor(options: ClientOptions) {
        super(options);

        this.commands = new CommandManager(this);
        this.subcommands = new SubcommandManager(this);
        this.modals = new ModalManager(this);
        this.selectMenus = new SelectMenuManager(this);
        this.events = new EventManager(this);
    }

    build(): this {
        this.commands.loadAll();
        this.events.loadAll();

        this.login(process.env.TOKEN);

        return this;
    }
}
