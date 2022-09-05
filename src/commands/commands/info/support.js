const { Interaction } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "support",
    description: "Join the QuaBot support server.",
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((err => { }));

        interaction.editReply({
            embeds: [await generateEmbed(color, "For questions, suggestions and more, join our support server at **[discord.gg/HYGA7Y6ptk](https://discord.gg/HYGA7Y6ptk)**.")]
        }).catch((err => { }));
    }
}