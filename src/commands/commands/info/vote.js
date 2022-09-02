const { Interaction } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "vote",
    description: "Vote for QuaBot",
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch(() => null);

        interaction.editReply({
            embeds: [await generateEmbed(color, "By voting for QuaBot, you can help us grow for free! It only takes a few seconds, and it gives you some perks! Vote **[here]()**.")]
        }).catch(() => null);
    }
}