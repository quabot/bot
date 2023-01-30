const { SlashCommandBuilder, Client, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");
const axios = require('axios');
const { shuffleArray } = require("../../utils/functions/array");

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


        const question = data.results[0];
        if (!question) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Failed to get a quiz question!')
            ]
        });

        const answersRaw = question.incorrect_answers;
        answersRaw.push(question.correct_answer);
        const answers = await shuffleArray(answersRaw);


        const row = new ActionRowBuilder();
        answers.forEach(answer => {
            const button = new ButtonBuilder()
                .setCustomId(`quiz-${answers.indexOf(answer)}`)
                .setLabel(answer.replaceAll('&quot;', '"'))
                .setStyle(ButtonStyle.Secondary);

            row.addComponents(button);
        });

        const message = await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription(`${question.question}`.replaceAll('&quot;', '"'))
            ], components: [row], fetchReply: true
        });

        const collector = message.createMessageComponentCollector({
            filter: ({ user }) => user.id === interaction.user.id,
            time: 60000
        });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'quiz-0') {
            }
        });
    }
}