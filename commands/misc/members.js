const discord = require('discord.js');
const colors = require('../files/colors.json');

module.exports = {
    name: "members",
    aliases: ["member", "list"],
    async execute(client, message, args) {

        console.log("Command `members` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

        const guild = message.guild
        const members = guild.memberCount;
        const membersEmbed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setDescription(`This server has **${members}** members!`)
        message.channel.send(membersEmbed)

    }
}