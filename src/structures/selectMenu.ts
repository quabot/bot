import type { AnySelectMenuInteraction, Client, ColorResolvable } from 'discord.js';

export interface SelectMenuArgs {
    client: Client;
    interaction: AnySelectMenuInteraction;
    color: ColorResolvable;
}

export interface SelectMenu {
    name: string;
    deferReply: boolean;
    ephemeral: boolean;
    callback: Function;
}

export class SelectMenu {
    constructor() {
        this.deferReply = true;
    }

    setName(name: string) {
        this.name = name;

        return this;
    }

    setDeferReply(deferReply: boolean) {
        this.deferReply = deferReply;

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
