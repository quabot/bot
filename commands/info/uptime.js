const discord = require('discord.js');  
const colors = require('../../files/colors.json');

module.exports = {
    name: "uptime",
    aliases: ['onlinetime'],
    async execute(client, message, args) {

        console.log("Command `uptime` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        const embed = new discord.MessageEmbed()
            .setDescription(`This bot has been online for: ${uptime}`)
            .setColor(colors.COLOR);
        message.channel.send({ embeds: [embed]});
    }
}