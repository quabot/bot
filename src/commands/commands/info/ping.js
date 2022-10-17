const { Interaction, Client, SlashCommandBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the response time between QuaBot and discord.')
        .setDMPermission(false),
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(client, interaction, color) {
        await interaction.deferReply().catch(e => {});

        interaction
            .editReply({
                embeds: [await generateEmbed(color, `🏓 **${client.ws.ping}ms**`)],
            })
            .catch(e => {});
    },
};
