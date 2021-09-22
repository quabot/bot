const discord = require('discord.js');
const colors = require('../../files/colors.json');
const moment = require('moment');
const config = require('../../files/config.json');

module.exports = {
    name: "server",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `server` was used.");
        const guild = message.guild
        const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = message.guild.members.cache;
        const channels = message.guild.channels.cache;
        const emojis = message.guild.emojis.cache;

        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return message.delete({ timeout: 5000 });
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timout: 5000 });
        const embed = new discord.MessageEmbed()
            .setTitle(`${message.guild.name} server info`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField(`Members:`, `${members.size}`, true)
            .addField(`Channels`, `${channels.size}`, true)
            .addField(`Text Channels`, `${channels.filter(channel => channel.type === "GUILD_TEXT").size}`, true)
            .addField(`Voice channels`, `${channels.filter(channel => channel.type === "GUILD_VOICE").size}`, true)
            .addField(`Boosts`, `${message.guild.premiumSubscriptionCount || '0'}`, true)
            .addField(`Emojis:`, `${emojis.size}`, true)
            .addField(`Time Created:`, `${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} [${moment(message.guild.createdTimestamp).fromNow()}]`)
            .addField(`Roles [${roles.length - 1}]`, roles.join(', '))
            .setColor(colors.COLOR)
        message.channel.send({ embeds: [embed]})

    }
}