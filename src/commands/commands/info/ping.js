const { Interaction, Client } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "ping",
    description: "Get the response time between QuaBot and discord.",
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((err => { }));

        interaction.editReply({    
            embeds: [await generateEmbed(color, `🏓 **${client.ws.ping}ms**`)]
        }).catch((err => { }));
    }
}