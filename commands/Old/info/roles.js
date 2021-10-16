const Discord = require('discord.js');
const colors = require('../../files/colors.json');

module.exports = {
    name: "roles",
    aliases: ["lr", "rl", "rolelist", "listroles"],
    async execute(client, message, args){

        const guild = message.guild
        const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return message.delete({ timeout: 5000 });
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timout: 5000 });

        const embed = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name} roles`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addField(`Roles [${roles.length - 1}]`, roles.join(', '))
        .setColor(colors.COLOR)
    message.channel.send({ embeds: [embed]})

    }
}