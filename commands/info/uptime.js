const discord = require('discord.js');
const colors = require('../../files/colors.json');

const {errorMain} = require('../../files/embeds')

module.exports = {
    name: "uptime",
    description: "Bot's uptime.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
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
                .setDescription(`has been online for: ${uptime}!\n(<t:${parseInt(client.readyTimestamp / 1000)}:R>`)
                .setThumbnail("https://i.imgur.com/jgdQUul.png")
                .setURL("https://status.watchbot.app/bot/845603702210953246")
                .setColor(colors.COLOR)
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}