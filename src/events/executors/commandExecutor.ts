import { Client, Colors, EmbedBuilder, Interaction, InteractionType } from 'discord.js';
import { commands } from '../../main';
import { handleError } from '../../utils/constants/errors';
import { getServerConfig } from '../../utils/configs/getServerConfig';

module.exports = {
    event: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        if (interaction.type !== InteractionType.ApplicationCommand) return;
        if (interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) return;
        if (!interaction.guildId) return;

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

        let color = '#3a5a74';
        const config: any = await getServerConfig(client, interaction.guildId);
        if (config) color = config.color;

        command.execute(client, interaction, color).catch((e: any) => handleError(client, e, interaction.commandName));
    },
};
