const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');

const { errorMain, debugError } = require('../../files/embeds');

module.exports = {
    name: "debug",
    description: "Command that is used for developement.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            if (interaction.user.id === "486563467810308096") {
                interaction.reply("**Please send a valid debug in chat:**\nError, no debugs configured.")
            } else {
                interaction.reply({ embeds: [debugError] })
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}