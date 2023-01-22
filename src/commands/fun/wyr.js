const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wyr')
        .setDescription('Get a would you rather dillema.')
        .setDMPermission(false),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();
        
        const { data:wyr } = await axios.get('https://would-you-rather-api.abaanshanid.repl.co');
        if (!wyr) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Failed to get a would you rather!')
            ]
        });


        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription(`${wyr.data}`)
            ]
        });
    }
}