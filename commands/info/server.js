const discord = require('discord.js');
const colors = require('../../files/colors.json');
const config = require('../../files/config.json');

module.exports = {
    name: "server",
    aliases: ["server"],
    async execute(client, message, args) {

        console.log("Command `server` was used.");

        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return message.delete({ timeout: 5000 });
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timout: 5000 });
        const embed = new discord.MessageEmbed()
            .setTitle(`${message.guild.name}`)
            .setColor(colors.COLOR)
        message.channel.send({ embeds: [embed]})

    }
}