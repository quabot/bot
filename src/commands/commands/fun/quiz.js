const { Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const { shuffleArray } = require('../../../structures/functions/arrays');

module.exports = {
    name: "quiz",
    description: "Play a quiz.",
    /**
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        const { data } = await axios.get('https://the-trivia-api.com/api/questions?limit=1&difficulty=easy');
        console.log(data);

        let answerList = data[0].incorrectAnswers;
        answerList.push(data[0].correctAnswer);

        answerList = await shuffleArray(answerList);

        let index = 1;
        const answerButtons = new ActionRowBuilder()
        answerList.forEach(q => {
            answerButtons.addComponents(
                new ButtonBuilder()
                    .setCustomId(`${index}`)
                    .setLabel(q)
                    .setStyle(ButtonStyle.Primary)
            )
            index++;
        });

        const message = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${data[0].question}`)
                    .setColor(color)
            ], fetchReply: true,
            components: [answerButtons]
        }).catch((e => console.log(e)));

        
    }
}