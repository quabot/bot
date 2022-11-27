import { Client, Colors, EmbedBuilder, Interaction, InteractionType } from 'discord.js';
import { modals } from '../../main';
import { handleError } from '../../utils/constants/errors';
import { getServerConfig } from '../../utils/configs/getServerConfig';

module.exports = {
    event: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        if (interaction.type !== InteractionType.ModalSubmit) return;
        if (!interaction.guildId) return;

        const modal: any = modals.get(interaction.customId);
        if (!modal)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`⚠️ An error occurred! Couldn't find the modal ${interaction.customId}!`)
                        .setTimestamp(),
                ],
            });

        let color = '#3a5a74';
        const config: any = await getServerConfig(client, interaction.guildId);
        if (config) color = config.color;

        modal.execute(client, interaction, color).catch((e: any) => handleError(client, e, interaction.customId));
    },
};
