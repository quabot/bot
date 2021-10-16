const discord = require('discord.js');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const config = require('../../files/config.json');

module.exports = {
    name: "info",
    description: "When using this command you will recieve a list of bot information.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        const embed = new discord.MessageEmbed()
            .setTitle(`${client.user.tag}`)
            .setThumbnail("https://i.imgur.com/jgdQUul.png")
            .addField("Version", config.VERSION)
            .addField("Servers", `${client.guilds.cache.size}`)
            .addField("Language", "English, Discord.js v13")
            .addField("Users", `${client.users.cache.size}`)
            .addField("Creator", "Joa_sss#0001")
            .addField("Commands", config.CMD_AMOUNT)
            .setFooter(`Uptime: ${uptime}`)
            .setColor(colors.COLOR)
        interaction.reply({ embeds: [embed]})
    }
}