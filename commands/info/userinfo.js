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
            if (!Discord.GuildMember.nickname) Discord.GuildMember.nickname = "None";
            if (user.bot = "false") user.bot = "False";
            if (user.status = "online") user.status = "Online";
            const embed = new Discord.MessageEmbed()
                .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
                .setColor(colors.COLOR)
                .setThumbnail(user.avatarURL({ dynamic: true}))
                .addField(`${user.tag}`, `${user}`, true)
                .addField("ID:", `${user.id}`, true)
                .addField("Status:", `${user.status}`, true) //add game                
                .addField("Joined The Server On:", `${moment.utc(Discord.GuildMember.joinedTimestamp).format("dddd, MMMM Do, YYYY")}`, true)
                .addField("Account Created On:", `${moment.utc(user.createdAt).format("dddd, MMMM Do,    YYYY")}`, true)
                .setTimestamp();
                if(user.bot === "true") embed.setFooter(`This user is a bot.`)
                
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}