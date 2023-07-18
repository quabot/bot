const { Client, Interaction, Colors } = require('discord.js');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const { handleError } = require('../../utils/constants/errorHandler');

module.exports = {
    event: "interactionCreate",
    name: "buttonExecutor",
    /**
     * @param {Interaction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isButton() || !interaction.guildId) return;

        const button = client.buttons.get(interaction.customId);
        if (!button) return;

        const config = await getServerConfig(client, interaction.guildId);
        const color = config?.color ?? '#416683';

        button.execute(client, interaction, color).catch((e) => handleError(client, e, interaction.customId));
    }
}