const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "color",
    description: "Visualize a color.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "color",
            description: "Hex string to visualize. (without #)",
            type: "STRING",
            required: true,
        }
    ],
    async execute(client, interaction) {

        try {
            let color = interaction.options.getString('color');

            const embed = new discord.MessageEmbed()
                .setTitle(`${color}`)
                .setColor(`${color}`)
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.reply({ ephemeral: true, content: ":x: Invalid hex string!" });
        }
    }
}