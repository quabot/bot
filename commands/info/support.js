const discord = require('discord.js');
const colors = require('../../files/colors.json');
const { SupportEmbed } = require('../../files/embeds');

module.exports = {
    name: "support",
    description: "Get support if you have issues with quabot.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        interaction.reply({ embeds: [SupportEmbed]});
    }
}