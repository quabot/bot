import { ModalBuilder } from 'discord.js';

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
