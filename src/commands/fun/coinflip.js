const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin.')
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        const flips = ['**🪙 Heads!**', '**🪙 Tails!**'];
        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription(flips[Math.floor(Math.random() * flips.length)])
            ]
        });
    }
}