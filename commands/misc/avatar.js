const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { avatar } = require('../../embeds/misc');

module.exports = {
    name: "avatar",
    description: "Get a user's avatar.",
    options: [
        {
            name: "user",
            type: "USER",
            description: "The user to get the avatar of.",
            required: false,
        }
    ],
    async execute(client, interaction) {
        try {
            let user = interaction.options.getUser('user') || interaction.user;
            let author = interaction.user;
            avatar.setImage(user.displayAvatarURL({ size: 1024, dynamic: true })).setFooter(`Requested by: ${author.tag}`).setTitle(`Avatar of ${user.username}`);
            interaction.reply({ embeds: [avatar] }).catch(err => console.log(err));;
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: avatar`)] }).catch(err => console.log(err));;
            return;
        }
    }
}