const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const quiz = require('../../../structures/files/quiz.json');

module.exports = {
    name: "quiz",
    description: "Play a quiz",
    async execute(client, interaction, color) {

        const quizItem = quiz[Math.floor(Math.random() * quiz.length)];

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`${quizItem.question}`)
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('quiz-1')
                            .setLabel(`${quizItem.option1}`)
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('quiz-2')
                            .setLabel(`${quizItem.option2}`)
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('quiz-3')
                            .setLabel(`${quizItem.option3}`)
                            .setStyle('SECONDARY')
                    )
            ]
        }).catch((err => { }));

    }
}