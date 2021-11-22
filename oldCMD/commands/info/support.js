const discord = require('discord.js');
const colors = require('../../files/colors.json');
const { SupportEmbed, errorMain } = require('../../files/embeds');

module.exports = {
    name: "support",
    description: "Get support if you have issues with quabot.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            interaction.reply({ embeds: [SupportEmbed]});
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}