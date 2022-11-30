import { type Client, Colors, EmbedBuilder, type Interaction } from 'discord.js';
import { subcommands } from '../..';
import { handleError } from '../../_utils/constants/errors';
import { getServerConfig } from '../../_utils/configs/getServerConfig';

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        try {
            if (!interaction.isChatInputCommand() || !interaction.guildId) return;

            const subcommandName = interaction.options.getSubcommand();
            if (!subcommandName) return;

            const subcommand: any = subcommands.get(`${subcommandName}/${interaction.commandName}`);
            if (!subcommand)
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setDescription(
                                `⚠️ An error occurred! Couldn't find the command ${interaction.commandName} with subcommand ${subcommandName}!`
                            )
                            .setTimestamp(),
                    ],
                });

            const config: any = await getServerConfig(client, interaction.guildId);
            const color = config?.color ?? '#3a5a74';

            subcommand
                .execute(client, interaction, color)
                .catch((e: Error) =>
                    handleError(client, e, `${interaction.options.getSubcommand()}/${interaction.commandName}`)
                );
        } catch (e) {
            return;
        }
    },
};
