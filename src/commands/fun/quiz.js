const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Play a multiple choice quiz.')
        .setDMPermission(false),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();
        
        const { data } = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        if (!data) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Failed to get a quiz question!')
            ]
        });
        

        const question = data.results;
        if (!question) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Failed to get a quiz question!')
            ]
        });


        console.log(question)

        // get array
        // shuffle
        // create message
        // handle the changes
    }
}