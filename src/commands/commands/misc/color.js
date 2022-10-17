const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Visualize a color using HEX.')
        .setDMPermission(false)
        .addStringOption(option => option.setName('hex').setRequired(true).setDescription('Hex color code. (#COLOR)')),
    /**
     * @param {import('discord.js').Interaction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply().catch(e => {});

        const hexColor = interaction.options.getString('hex');

        if (!/^#([0-9A-F]{3}){1,2}$/i.test(hexColor))
            return interaction
                .editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTimestamp()
                            .setDescription(
                                'Invalid hex color! Please give a [valid](https://www.hexcolortool.com) hex color.'
                            ),
                    ],
                })
                .catch(e => {});

        interaction
            .editReply({
                embeds: [new EmbedBuilder().setColor(hexColor).setDescription(`**${hexColor}**`).setTimestamp()],
            })
            .catch(e => {});
    },
};
