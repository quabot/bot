const discord = require('discord.js');
const colors = require('../files/colors.json');

module.exports = {
    name: "support",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `support` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setThumbnail("https://i.imgur.com/8HHHGK1.png")
            .setDescription("**Do you need support?**\n\nIf you run into an issue, have a question or just wanna chat with people you can join our support discord.\nBot downtime, updates and more are also announced here.\n\nInvite: https://discord.gg/kNfy8MRF4n");
        message.channel.send(embed);
    }
}