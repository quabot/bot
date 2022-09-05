const { Interaction } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "dashboard",
    description: "Get a link to the QuaBot dashboard.",
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((err => { }));

        interaction.editReply({
            embeds: [await generateEmbed(color, "Configure QuaBot on our dashboard **[here](https://dashboard.quabot.net)**.")]
        }).catch((err => { }));
    }
}