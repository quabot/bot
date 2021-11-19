const discord = require('discord.js');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json')

module.exports = {
    name: "quabot",
    description: "This command is for testing purposes.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        interaction.reply("QuaBot")
    }
}
