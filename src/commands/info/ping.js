const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the latency between QuaBot and the Discord API.')
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        await interaction.editReply({
            embeds: [
                new Embed(color)
                .setDescription(`🏓 **${client.ws.ping}ms**`),
            ]
        });
    }
}