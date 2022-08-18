const { Interaction, EmbedBuilder, Client } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Get the response time between QuaBot and discord.",
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`🏓 **${client.ws.ping}ms**`)
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}