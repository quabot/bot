import {
    SlashCommandBuilder,
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    type ChatInputCommandInteraction,
    type Client,
    type ColorResolvable,
} from 'discord.js';

type boolOrChild = boolean | 'children';

export interface CommandArgs {
    client: Client;
    interaction: ChatInputCommandInteraction;
    color: ColorResolvable;
}

export interface Command {
    deferReply: boolOrChild;
    ephemeral: boolOrChild;
    callback: Function;
}

export class Command extends SlashCommandBuilder {
    constructor() {
        super();

        this.deferReply = true;
    }

    setDeferReply(deferReply: boolOrChild) {
        this.deferReply = deferReply;
    }

    setEphemeral(ephemeral: boolOrChild) {
        this.ephemeral = ephemeral;

        return this;
    }

    setCallback(callback: Function) {
        this.callback = callback;

        return this;
    }

    override toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
        return Object.assign(super.toJSON(), {
            type: ApplicationCommandType.ChatInput,
        });
    }
}
