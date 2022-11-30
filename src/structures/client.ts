import { Client as BaseClient, type ClientOptions } from 'discord.js';
import { CommandManager, EventManager } from '.';

interface ClientConfig {
    token: string;
    guildId: string;
}

export interface Client {
    config: ClientConfig;
    events: EventManager;
    commands: CommandManager;
}

export class Client extends BaseClient {
    constructor(options: ClientOptions) {
        super(options);

        this.events = new EventManager(this);
        this.commands = new CommandManager(this);
    }

    build(): this {
        this.events.loadAll();
        this.commands.loadAll();

        this.login(process.env.TOKEN);

        return this;
    }
}
