const discord = require('discord.js');
const colors = require('../../files/colors.json');

module.exports = {
    name: "avatar",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `avatar` was used.");

        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return message.delete({ timeout: 5000 });
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timout: 5000 });

        let user = message.author || message.mentions.users.first();
        let author = message.author;
        let avatar = user.displayAvatarURL({ size: 1024, dynamic: true });

        const embed = new discord.MessageEmbed()
            .setTitle(`Avatar of ${user.username}`)
            .setImage(avatar)
            .setColor(colors.COLOR)
            .setFooter(`Requested by: ${author.tag}`)
        message.channel.send({ embeds: [embed]});
    }
}