const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "color",
    description: "Visualize a color.",
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

            const embed = new MessageEmbed()
                .setTitle(`#${color}`)
                .setColor(`${color}`)
            interaction.reply({ embeds: [embed] }).catch(err => console.log("Error!"));
        } catch (e) {
            interaction.reply({ ephemeral: true, content: ":x: Invalid hex string!" }).catch(err => console.log("Error!"));
            return;
        }
    }
}