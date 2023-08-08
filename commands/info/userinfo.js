const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "userinfo",
    aliases: ['memberinfo', "whois"],
    async execute(client, message, args) {

        console.log("Command `userinfo` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

        let user = message.mentions.users.first() || message.author;

        const joinDiscord = moment(user.createdAt).format('llll');
        const joinServer = moment(user.joinedAt).format('llll');

        if (!Discord.GuildMember.nickname) Discord.GuildMember.nickname = "None";

        if (user.bot = "false") user.bot = "False";
        if (user.presence.status = "online") user.presence.stats = "Online";

        let embed = new Discord.MessageEmbed()
            .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
            .setColor(`RANDOM`)
            .setImage(user.avatarURL())
            .addField(`${user.tag}`, `${user}`, true)
            .addField("ID:", `${user.id}`, true)
            .addField("Nickname:", `${Discord.GuildMember.nickname !== null ? `${Discord.GuildMember.nickname}` : 'None'}`, true)
            .addField("Status:", `${user.presence.status}`, true)
            .addField("Game:", `${user.presence.game ? user.presence.game.name : 'None'}`, true)
            .addField("Bot:", `${user.bot}`, true)
            .addField("Joined The Server On:", `${moment.utc(Discord.GuildMember.joinedAt).format("dddd, MMMM Do YYYY")}`, true)
            .addField("Account Created On:", `${moment.utc(user.createdAt).format("dddd, MMMM Do YYYY")}`, true)
            .setFooter(`Replying to ${message.author.username}#${message.author.discriminator}`)
            .setFooter(`ID: ${user.id}`)
            .setTimestamp();
        message.channel.send({ embed: embed });
    }
}