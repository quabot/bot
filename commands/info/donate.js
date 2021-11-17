const discord = require("discord.js");

const colors = require('../../files/colors.json');
const { DonateEmbed, errorMain } = require('../../files/embeds');

module.exports = {
    name: "donate",
    description: "This command is used to get info about donations to quabot.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            interaction.reply({embeds: [DonateEmbed]});
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain]})
            console.log(e)
        }
    }
}