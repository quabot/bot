import { Client, Colors, EmbedBuilder, Interaction, InteractionType } from 'discord.js';
import consola from 'consola';
import { commands } from '../../main';

module.exports = {
    event: "interactionCreate",
    async execute(interaction: Interaction, client: Client) {
        if (interaction.type !== InteractionType.ApplicationCommand) return;
        if (interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) return;
        if (!interaction.guildId) return;

        const command:any = commands.get(interaction.commandName);
        if (!command) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`⚠️ An error occurred! Couldn't find the command ${interaction.commandName}!`)
                    .setTimestamp(),
            ]
        });

        command.execute(client, interaction, '#3a5a74');
    }
}