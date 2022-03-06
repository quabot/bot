const { MessageEmbed, GuildMember } = require('discord.js');
const moment = require('moment');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "userinfo",
    description: "Information about a user.",
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
            if (user.bot = "false") user.bot = "False";
            if (user.status = "online") user.status = "Online";
            const embed = new MessageEmbed()
                .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
                .setColor(COLOR_MAIN)
                .setThumbnail(user.avatarURL({ dynamic: true }))
                .addField(`${user.tag}`, `${user}`, true)
                .addField("ID:", `${user.id}`, true)
                .addField("Nickname", `${GuildMember.nickname}`, true)
                .addField("Status:", `${user.status}`, true) //add game                
                .addField("Joined The Server On:", `${moment.utc(GuildMember.joinedTimestamp).format("dddd, MMMM Do, YYYY")}`, true)
                .addField("Account Created On:", `${moment.utc(user.createdAt).format("dddd, MMMM Do,    YYYY")}`, true)
                ;
            if (user.bot === "true") embed.setDescription(`This user is a bot.`)
            interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: serverinfo`)] }).catch(err => console.log(err));;
            return;
        }
    }
}