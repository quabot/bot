import { type Client, Colors, EmbedBuilder, type Interaction } from 'discord.js';
import { selectors } from '../..';
import { handleError } from '../../utils/constants/errors';
import { getServerConfig } from '../../utils/configs/getServerConfig';

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        if (!interaction.isSelectMenu() || !interaction.guildId) return;

        const select: any = selectors.get(interaction.customId);
        if (!select)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`⚠️ An error occurred! Couldn't find the select menu ${interaction.customId}!`)
                        .setTimestamp(),
                ],
            });

        const config: any = await getServerConfig(client, interaction.guildId);
        const color = config?.color ?? '#3a5a74';

        select.execute(client, interaction, color).catch((e: Error) => handleError(client, e, interaction.customId));
    },
};
