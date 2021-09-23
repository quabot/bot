const discord = require('discord.js');
const colors = require('../../files/colors.json');

module.exports = {
    name: "members",
    aliases: ["member", "list"],
    async execute(client, message, args) {

        console.log("Command `members` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const guild = message.guild
        const members = guild.memberCount;
        const membersEmbed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setTitle(`${message.guild.name} has **${members}** members!`)
        message.channel.send({ embeds: [membersEmbed] })

    }
}