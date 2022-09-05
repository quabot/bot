const { Interaction } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "flip",
    description: "Flip a coin.",
    /**
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) { 

        await interaction.deferReply().catch((e => { }));

        const flips = ["**🪙 Heads!**", "**🪙 Tails!**"];
        interaction.editReply({
            embeds: [await generateEmbed(color, flips[Math.floor(Math.random() * flips.length)])]
        }).catch((e => { }));
    }
}