const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "color",
    description: "Visualize a color using HEX.",
    options: [
        {
            name: "hex",
            description: "Hex color code. (#COLOR)",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    /**
     * @param {import('discord.js').Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();


        const hexColor = interaction.options.getString("hex");

        if (!/^#([0-9A-F]{3}){1,2}$/i.test(hexColor)) return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTimestamp()
                    .setDescription("Invalid hex color! Please give a [valid](https://www.hexcolortool.com) hex color.")
            ]
        }).catch((e => { }));

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(hexColor)
                    .setDescription(`**${hexColor}**`)
            ]
        }).catch((e => { }));
    }
}