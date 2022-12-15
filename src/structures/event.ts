import type { ClientEvents } from 'discord.js';
import type { Client } from '.';

export interface EventArgs {
    client: Client;
}

export interface Event {
    name: keyof ClientEvents;
    once: boolean;
    callback: Function;
}

export class Event {
    setName(name: keyof ClientEvents) {
        this.name = name;

        return this;
    }

    setOnce(once: boolean) {
        this.once = once;

        return this;
    }

    setCallback(callback: Function) {
        this.callback = callback;

        return this;
    }
}
