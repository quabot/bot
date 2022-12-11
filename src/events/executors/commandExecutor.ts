import type { Interaction } from 'discord.js';
import { handleError } from '../../_utils/constants/errors';
import { Event, type EventArgs } from '../../structures';
import { getServerColor } from '../../utils';

export default new Event()
    .setName('interactionCreate')
    .setCallback(async ({ client }: EventArgs, interaction: Interaction) => {
        if (!interaction.isChatInputCommand() || !interaction.guildId) return;

        const color = await getServerColor(client, interaction.guildId);

        await client.commands
            .execute({ client, interaction, color })
            .catch((e: Error) => handleError(client, e, interaction.commandName));
    });
