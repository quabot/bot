import {
    SlashCommandBuilder,
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

type ephemeral = boolean | 'children';

export interface Command {
    ephemeral: ephemeral;
    callback: Function;
}

export class Command extends SlashCommandBuilder {
    setEphemeral(ephemeral: ephemeral) {
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
