import { ModalBuilder, type ModalSubmitInteraction, type Client, type ColorResolvable } from 'discord.js';

export interface ModalArgs {
    client: Client;
    interaction: ModalSubmitInteraction;
    color: ColorResolvable;
}

export interface Modal {
    customId: string;
    ephemeral: boolean;
    callback: Function;
}

export class Modal extends ModalBuilder {
    setEphemeral(ephemeral: boolean) {
        this.ephemeral = ephemeral;

        return this;
    }

    setCallback(callback: Function) {
        this.callback = callback;

        return this;
    }
}
