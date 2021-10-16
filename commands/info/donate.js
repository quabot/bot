const discord = require("discord.js");

const colors = require('../../files/colors.json');
const {DonateEmbed} = require('../../files/embeds');

module.exports = {
    name: "donate",
    description: "This command is used to get info about donations to quabot.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        interaction.reply({embeds: [DonateEmbed]});
    }
}