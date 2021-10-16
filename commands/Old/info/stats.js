const Discord = require('discord.js');
const colors = require('../../files/colors.json');
const config = require('../../files/config.json');

module.exports = {
    name: "stats",
    aliases: ["statistics"],
    async execute(client, message, args) {
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const embed = new Discord.MessageEmbed()
            .setTitle("Quabot Statistics")
            .setColor(colors.COLOR)
            .setThumbnail("https://i.imgur.com/jgdQUul.png")
            .addField("CPU", "unknown", true)
            .addField("Memory","2GB", true)
            .addField("Library", "Discord.js V13", true)
            .addField("Node.js Version", "16.9.1", true)
            .addField("Version", config.VERSION, true)
            .addField("Commands", config.CMD_AMOUNT, true)
            .addField("Channels", `${client.channels.cache.size}`, true)
            .addField("Users", `${client.users.cache.size}`, true)
            .addField("Servers", `${client.guilds.cache.size}`, true);
        message.channel.send({ embeds: [embed]});
    }

}