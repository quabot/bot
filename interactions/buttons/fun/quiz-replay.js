const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    id: "quiz-replay",
    async execute(interaction, client, color) {


        const quizQuestions = require('../../../structures/files/quiz.json');
        const quizItem = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];

        interaction.update({
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
                            .setStyle('SECONDARY'),
                        new ButtonBuilder()
                            .setCustomId('quiz-2')
                            .setLabel(`${quizItem.option2}`)
                            .setStyle('SECONDARY'),
                        new ButtonBuilder()
                            .setCustomId('quiz-3')
                            .setLabel(`${quizItem.option3}`)
                            .setStyle('SECONDARY')
                    )
            ]
        }).catch((err => { }));

    }
}