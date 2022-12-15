import type { ButtonInteraction, ColorResolvable } from 'discord.js';
import type { Client } from '.';

export interface ButtonArgs {
    client: Client;
    interaction: ButtonInteraction;
    color: ColorResolvable;
}

export interface Button {
    name: string;
    deferReply: boolean;
    ephemeral: boolean;
    callback: Function;
}

export class Button {
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
