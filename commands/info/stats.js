const Discord = require('discord.js');
const colors = require('../../files/colors.json');

module.exports = {
    name: "stats",
    aliases: ["statistics"],
    async execute(client, message, args) {

        console.log("Command `stats` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const embed = new Discord.MessageEmbed()
            .setTitle("Quabot Statistics")
            .setColor(colors.COLOR)
            .setThumbnail("https://i.imgur.com/8HHHGK1.png")
            .addField("CPU", "Xeon E5-1630v3 @3.7Ghz")
            .addField("Memory","1024MB")
            .addField("Channels", `${client.channels.cache.size}`)
            .addField("Users", `${client.users.cache.size}`)
            .addField("Servers", `${client.guilds.cache.size}`);
        message.channel.send({ embeds: [embed]});
    }

}