const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "power",
    description: "Get the power of a number.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
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
            const embed = new discord.MessageEmbed()
                .setTitle(`${no1}^${no2} = ${no1**no2}`)
                .setColor(colors.COLOR)
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}