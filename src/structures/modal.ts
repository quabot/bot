import { ModalBuilder, type ModalSubmitInteraction, type Client, type ColorResolvable } from 'discord.js';

export interface ModalArgs {
    client: Client;
    interaction: ModalSubmitInteraction;
    color: ColorResolvable;
}

export interface Modal {
    customId: string;
    deferReply: boolean;
    ephemeral: boolean;
    callback: Function;
}

export class Modal extends ModalBuilder {
    constructor() {
        super();

        this.deferReply = true;
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
