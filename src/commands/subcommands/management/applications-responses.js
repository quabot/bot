const { Interaction, Client, PermissionFlagsBits } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "responses",
    command: "applications",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {
        await interaction.reply({
            embeds: [await generateEmbed(color, "You can view, approve and deny responses on my [dashboard](https://dashboard.quabot.net)!")]
        }).catch((e => { }));
    }
}