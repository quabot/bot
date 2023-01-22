const { Client, Interaction, Colors } = require('discord.js');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const { handleError } = require('../../utils/constants/errorHandler');

module.exports = {
    event: "interactionCreate",
    name: "menuExecutor",
    /**
     * @param {Interaction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isSelectMenu() || !interaction.guildId) return;

        const menu = client.menus.get(interaction.customId);
        if (!menu) return;

        const config = await getServerConfig(client, interaction.guildId);
        const color = config?.color ?? '#3a5a74';

        menu.execute(client, interaction, color).catch((e) => handleError(client, e, interaction.customId));
    }
}