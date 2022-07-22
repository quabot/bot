const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const quiz = require('../../../structures/files/quiz.json');

module.exports = {
    name: "quiz",
    description: "Play a quiz",
    async execute(client, interaction, color) {

        const quizItem = quiz[Math.floor(Math.random() * quiz.length)];

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`${quizItem.question}`)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('quiz-1')
                            .setLabel(`${quizItem.option1}`)
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('quiz-2')
                            .setLabel(`${quizItem.option2}`)
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('quiz-3')
                            .setLabel(`${quizItem.option3}`)
                            .setStyle(ButtonStyle.Secondary)
                    )
            ]
        }).catch((err => { }));

    }
}