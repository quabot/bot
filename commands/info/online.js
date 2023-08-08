const discord = require('discord.js');
const colors = require('../../files/colors.json');

module.exports = {
    name: "online",
    aliases: ["presence"],
    async execute(client, message, args) {

        console.log("Command `online` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const members = message.guild.members.cache;

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription(`**${members.filter(member => member.presence.status === 'online').size}** users are online,\n**${members.filter(member => member.presence.status === 'idle').size}** on Idle,\n**${members.filter(member => member.presence.status === 'dnd').size}** on Do Not Disturb, and\n**${members.filter(member => member.presence.status === 'offline').size}** offline.`);
        message.channel.send({ embeds: [embed]});
    }
}