const { MessageEmbed } = require('discord.js');
const { error } = require('../../embeds/general');
const { support } = require('../../embeds/info');

module.exports = {
    name: "support",
    description: "Official bot support server.",
    async execute(client, interaction) {
        try {
            interaction.reply({ embeds: [support] }).catch(err => console.log("Error!"));;
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: cat`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}