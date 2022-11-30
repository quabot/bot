import { type Client, Colors, EmbedBuilder, type Interaction } from 'discord.js';
import { buttons } from '../../main';
import { handleError } from '../../utils/constants/errors';
import { getServerConfig } from '../../utils/configs/getServerConfig';

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        if (!interaction.isButton() || !interaction.guildId) return;

        const button: any = buttons.get(interaction.customId);
        if (!button)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`⚠️ An error occurred! Couldn't find the button ${interaction.customId}!`)
                        .setTimestamp(),
                ],
            });

        const config: any = await getServerConfig(client, interaction.guildId);
        const color = config?.color ?? '#3a5a74';

        button.execute(client, interaction, color).catch((e: Error) => handleError(client, e, interaction.customId));
    },
};
