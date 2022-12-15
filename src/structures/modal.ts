import type { ModalSubmitInteraction, ColorResolvable } from 'discord.js';
import type { Client } from '.';

export interface ModalArgs {
    client: Client;
    interaction: ModalSubmitInteraction;
    color: ColorResolvable;
}

export interface Modal {
    name: string;
    deferReply: boolean;
    ephemeral: boolean;
    callback: Function;
}

export class Modal {
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
