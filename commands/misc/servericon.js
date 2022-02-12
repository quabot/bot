const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "servericon",
    description: "Server's icon.",
    async execute(client, interaction) {
        try {
            const membersEmbed = new MessageEmbed().setColor(COLOR_MAIN).setImage(interaction.guild.iconURL({ dynamic: true })).setTitle(`${interaction.guild.name}`)
            if (!interaction.guild.iconURL({ dynamic: true })) membersEmbed.setDescription("This guild does not have an icon.");
            interaction.reply({ embeds: [membersEmbed] }).catch(err => console.log("Error!"));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: bio`)] }).catch(err => console.log("Error!"));
            return;
        }
    }
}