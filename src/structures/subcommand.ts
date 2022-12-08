export interface Subcommand {
    parent: string;
    name: string;
    deferReply: boolean;
    ephemeral: boolean;
    callback: Function;
}

export class Subcommand {
    constructor() {
        this.deferReply = true;
    }

    setParent(parent: string) {
        this.parent = parent;

        return this;
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
