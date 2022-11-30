import { type Client, Colors, EmbedBuilder, type Interaction } from 'discord.js';
import { commands } from '../..';
import { handleError } from '../../_utils/constants/errors';
import { getServerConfig } from '../../_utils/configs/getServerConfig';

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        if (!interaction.isChatInputCommand() || !interaction.guildId) return;

        const command: any = commands.get(interaction.commandName);
        if (!command)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`⚠️ An error occurred! Couldn't find the command ${interaction.commandName}!`)
                        .setTimestamp(),
                ],
            });

        const config: any = await getServerConfig(client, interaction.guildId);
        const color = config?.color ?? '#3a5a74';

        await command
            .execute(client, interaction, color)
            .catch((e: Error) => handleError(client, e, interaction.commandName));
    },
};
