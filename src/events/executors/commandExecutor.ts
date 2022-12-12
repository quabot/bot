import type { Interaction } from 'discord.js';
import { Event, type EventArgs } from '../../structures';
import {
    getServerColor,
    // handleError
} from '../../utils';

export default new Event()
    .setName('interactionCreate')
    .setCallback(async ({ client }: EventArgs, interaction: Interaction) => {
        if (
            !interaction.isChatInputCommand() ||
            !interaction.guildId ||
            client.subcommands.filter(subcommand => subcommand.parent === interaction.commandName).size > 0
        )
            return;

        const color = await getServerColor(client, interaction.guildId);

        await client.commands.execute({ client, interaction, color }).catch(
            (e: Error) => console.log(e)
            // handleError(client, e, interaction.commandName)
        );
    });
