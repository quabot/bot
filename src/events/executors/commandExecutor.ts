import type { Interaction } from 'discord.js';
import { handleError } from '../../_utils/constants/errors';
import { getServerConfig } from '../../_utils/configs/getServerConfig';
import { Event, type EventArgs } from '../../structures';

export default new Event()
    .setName('interactionCreate')
    .setCallback(async ({ client }: EventArgs, interaction: Interaction) => {
        if (!interaction.isChatInputCommand() || !interaction.guildId) return;

        const config: any = await getServerConfig(client, interaction.guildId);
        const color = config?.color ?? '#3a5a74';

        await client.commands
            .execute({ client, interaction, color })
            .catch((e: Error) => handleError(client, e, interaction.commandName));
    });
