const discord = require('discord.js');
const mongoose = require('mongoose');
const colors = require('../../files/colors.json');
const config = require('../../files/config.json');

const { errorMain, addedDatabase, muteNoUser, muteNoRoleManage, muteNoPermsUser } = require('../../files/embeds');

module.exports = {
    name: "mute",
    description: "Mute a member.",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            
            
            const removed = new discord.MessageEmbed()
                .setTitle(":x: Removed")
                .setDescription("The /mute and /tempmute commands have been removed from quabot and have since been replaced with /timeout!")
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            interaction.reply({ embeds: [removed] });
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}