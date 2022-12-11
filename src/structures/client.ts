import { Client as BaseClient, type ClientOptions } from 'discord.js';
import NodeCache from 'node-cache';
import { CommandManager, SubcommandManager, ModalManager, SelectMenuManager, EventManager } from '.';

export interface ClientInfo {
    djs: string;
    njs: string;
    cpu: string;
    platform: string;
}

export interface Client {
    cache: NodeCache;

    commands: CommandManager;
    subcommands: SubcommandManager;
    modals: ModalManager;
    selectMenus: SelectMenuManager;
    events: EventManager;
}

export class Client extends BaseClient {
    constructor(options: ClientOptions) {
        super(options);

        this.cache = new NodeCache();

        this.commands = new CommandManager(this);
        this.subcommands = new SubcommandManager(this);
        this.modals = new ModalManager(this);
        this.selectMenus = new SelectMenuManager(this);
        this.events = new EventManager(this);
    }

    build() {
        this.commands.loadAll();
        this.subcommands.loadAll();
        this.modals.loadAll();
        this.selectMenus.loadAll();
        this.events.loadAll();

        this.login(process.env.TOKEN);

        return this;
    }
}
