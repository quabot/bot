const { Interaction, SlashCommandBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flip a coin.')
        .setDMPermission(false),
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