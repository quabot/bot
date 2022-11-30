import type { ChatInputCommandInteraction, Client, ColorResolvable } from 'discord.js';

export interface SubcommandArgs {
    client: Client;
    interaction: ChatInputCommandInteraction;
    color: ColorResolvable;
}

export interface Subcommand {
    parent: string;
    name: string;
    ephemeral: boolean;
    callback: Function;
}

export class Subcommand {
    setParent(parent: string) {
        this.parent = parent;

        return this;
    }

    setName(name: string) {
        this.name = name;

        return this;
    }

    setEphemeral(ephemeral: boolean) {
        this.ephemeral = ephemeral;

        return this;
    }

    setCallback(callback: Function) {
        this.callback = callback;

        return this;
    }
}
