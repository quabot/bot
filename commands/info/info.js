const discord = require('discord.js');
const colors = require('../../files/colors.json');
const config = require('../../files/config.json');

module.exports = {
    name: "info",
    aliases: ["information"],
    async execute(client, message, args) {

        console.log("Command `info` was used.");

        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return message.delete({ timeout: 5000 });
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timout: 5000 });

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
            .addField("Language", "English, discord.js")
            .addField("Users", `${client.users.cache.size}`)
            .addField("Creator", "do#8888")
            .addField("Commands", config.CMD_AMOUNT)
            .setFooter(`Uptime: ${uptime}`)
            .setColor(colors.COLOR)
        message.channel.send({ embeds: [embed]})

    }
}