const { Client, Interaction, Colors } = require('discord.js');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const { handleError } = require('../../utils/constants/errorHandler');

module.exports = {
    event: "interactionCreate",
    name: "commandExecutor",
    /**
     * @param {Interaction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand() || !interaction.guildId) return;

        const command = client.commands.get(interaction.commandName);
        if (!command)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`⚠️ An error occurred! Couldn't find the command ${interaction.commandName}!`)
                        .setTimestamp(),
                ],
            });

        const config = await getServerConfig(client, interaction.guildId);
        const color = config?.color ?? '#3a5a74';

        await command
            .execute(client, interaction, color)
            .catch((e) => handleError(client, e, interaction.commandName));
    }
}