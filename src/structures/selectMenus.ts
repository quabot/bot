import {
    RoleSelectMenuBuilder,
    UserSelectMenuBuilder,
    StringSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    MentionableSelectMenuBuilder,
} from 'discord.js';

interface BaseSelectMenu {
    customId: string;
    ephemeral: boolean;
    callback: Function;
}

export interface RoleSelectMenu extends BaseSelectMenu {}
export interface UserSelectMenu extends BaseSelectMenu {}
export interface StringSelectMenu extends BaseSelectMenu {}
export interface ChannelSelectMenu extends BaseSelectMenu {}
export interface MentionableSelectMenu extends BaseSelectMenu {}

export class RoleSelectMenu extends RoleSelectMenuBuilder {
    constructor() {
        super();

        this.customId = '';
        this.ephemeral = false;
        this.callback = () => {};
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

export class UserSelectMenu extends UserSelectMenuBuilder {
    constructor() {
        super();

        this.customId = '';
        this.ephemeral = false;
        this.callback = () => {};
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

export class StringSelectMenu extends StringSelectMenuBuilder {
    constructor() {
        super();

        this.customId = '';
        this.ephemeral = false;
        this.callback = () => {};
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

export class ChannelSelectMenu extends ChannelSelectMenuBuilder {
    constructor() {
        super();

        this.customId = '';
        this.ephemeral = false;
        this.callback = () => {};
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

export class MentionableSelectMenu extends MentionableSelectMenuBuilder {
    constructor() {
        super();

        this.customId = '';
        this.ephemeral = false;
        this.callback = () => {};
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

export type AnySelectMenu =
    | RoleSelectMenu
    | UserSelectMenu
    | StringSelectMenu
    | ChannelSelectMenu
    | MentionableSelectMenu;
