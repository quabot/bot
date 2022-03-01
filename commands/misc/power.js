const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "power",
    description: "Get the power of a number.",
    options: [
        {
            name: "number",
            description: "Number",
            type: "INTEGER",
            required: true,
        },
        {
            name: "power",
            description: "Power",
            type: "INTEGER",
            required: true,
        }
    ],
    async execute(client, interaction) {

        try {
            let no1 = interaction.options.getInteger('number');
            let no2 = interaction.options.getInteger('power');
            const embed = new MessageEmbed().setTitle(`${no1}^${no2} = ${no1**no2}`).setColor(COLOR_MAIN)
            interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: power`)] }).catch(err => console.log(err));
            return;
        }
    }
}