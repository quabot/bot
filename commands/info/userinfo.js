const Discord = require('discord.js');
const moment = require('moment');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "userinfo",
    description: "Information about a user.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "User to get info about",
            type: "USER",
            required: false,
        }
    ],
    async execute(client, interaction) {

        try {
            let user = interaction.options.getUser('user') || interaction.user;
            const joinDiscord = moment(user.createdAt).format('llll');
            const joinServer = moment(user.joinedAt).format('llll');
            if (!Discord.GuildMember.nickname) Discord.GuildMember.nickname = "None";
            if (user.bot = "false") user.bot = "False";
            if (user.status = "online") user.status = "Online";

            const embed = new Discord.MessageEmbed()
                .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
                .setColor(colors.COLOR)
                .setImage(user.avatarURL())
                .addField(`${user.tag}`, `${user}`, true)
                .addField("ID:", `${user.id}`, true)
                .addField("Nickname:", `${Discord.GuildMember.nickname !== null ? `${Discord.GuildMember.nickname}` : 'None'}`, true)
                .addField("Status:", `${user.status}`, true) //add game
                .addField("Bot:", `${user.bot}`, true)
                .addField("Joined The Server On:", `${moment.utc(Discord.GuildMember.joinedTimestamp).format("dddd, MMMM Do, YYYY")}`, true)
                .addField("Account Created On:", `${moment.utc(user.createdAt).format("dddd, MMMM Do,    YYYY")}`, true)
                .setFooter(`Replying to ${interaction.user.username}#${interaction.user.discriminator}`)
                .setFooter(`ID: ${user.id}`)
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}