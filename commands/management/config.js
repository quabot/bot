const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { disabledLevelUp, roleEmbed, channelEmbed, welcomeDisabled, welcomeEnabled, ticketDisabled, ticketEnabled, suggestEnabled, suggestDisabled1, toggleEmbed2, reportDisabled, reportEnabled, musicDisabled, musicEnabled, errorMain, optionsEmbed, noPerms, toggleEmbed, levelsDisabled, levelsEnabled, logsDisabled, logsEnabled, swearDisabled, swearEnabled } = require('../../files/embeds');
const { role, channel, nextPage3, nextPage4, channel2, welcomeButtons, ticketButtons, suggestButtons, toggle2, nextPage2, nextPage1, reportButtons, musicButtons, selectCategory, disabledToggle, levelsButtons, toggle, logButtons, swearButtons, disableLevel } = require('../../files/interactions');

module.exports = {
    name: "config",
    description: "Change settings for your server.",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {

        interaction.reply({ ephemeral: true, embeds: [optionsEmbed], components: [selectCategory] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain]})
            console.log(e)
        }
        
    }
}