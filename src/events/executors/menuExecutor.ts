import { Client, Colors, EmbedBuilder, Interaction, InteractionType } from 'discord.js';
import { commands, selectors } from '../../main';
import { handleError } from '../../utils/constants/errors';
import { getServerConfig } from '../../utils/configs/getServerConfig';

module.exports = {
    event: "interactionCreate",
    async execute(interaction: Interaction, client: Client) {
        if (!interaction.isSelectMenu()) return;
        if (!interaction.guildId) return;

        const select:any = selectors.get(interaction.customId);
        if (!select) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`⚠️ An error occurred! Couldn't find the select menu ${interaction.customId}!`)
                    .setTimestamp(),
            ]
        });

        let color = "#3a5a74";
        const config:any = await getServerConfig(client, interaction.guildId);
        if (config) color = config.color;

        select.execute(client, interaction, color).catch((e:any) => handleError(client, e, interaction.customId));
    }
}