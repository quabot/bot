const discord = require('discord.js');

const colors = require('../../files/colors.json');

module.exports = {
    name: "online",
    aliases: ["presence"],
    async execute(client, message, args) {
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const members = message.guild.members.cache;
        const totalMembers = message.guild.memberCount;
        const online = members.filter(user => user.presence?.status === 'online').size;
        const idle = members.filter(user => user.presence?.status === 'idle').size;
        const dnd = members.filter(user => user.presence?.status === 'dnd').size;
        const totalOffline = totalMembers - idle - dnd - online;

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setTitle(`${message.guild.name}`)
            .addField("Online:", `${online}`, true)
            .addField("Do Not Disturb:", `${dnd}`, true)
            .addField("Offline:", `${totalOffline}`, true)
            .setFooter(`Total Members: ${totalMembers}`)
        message.channel.send({ embeds: [embed]});
    }
}