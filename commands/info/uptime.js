const discord = require('discord.js');
const colors = require('../../files/colors.json');

module.exports = {
    name: "uptime",
    description: "When using this command, the current online time of the bot is displayed.",
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
            .setDescription(`has been online for: ${uptime}!`)
            .setThumbnail("https://i.imgur.com/jgdQUul.png")
            .setColor(colors.COLOR);
        interaction.reply({ embeds: [embed] });
    }
}