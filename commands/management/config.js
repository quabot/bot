const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { config } = require('../../embeds/management');
const { configSelect } = require('../../interactions/management');

module.exports = {
    name: "config",
    description: "Configure quabot.",
    permission: "ADMINISTRATOR",
    async execute(client, interaction) {

        try {
            interaction.reply({ ephemeral: true, embeds: [config], components: [configSelect] }).catch(err => console.log("Error!"));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: clear`)] }).catch(err => console.log("Error!"));
            return;
        }
    }
}