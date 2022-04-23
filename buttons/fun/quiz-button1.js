module.exports = {
    id: "quiz1",
    execute(interaction, color) {
        const quizQuestion = interaction.message.embeds[0].description;

        const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
        const quiz = require('../../structures/files/quiz.json');

        function getQuizAnswers(desc) {
            return quiz.filter(function (quiz) { return quiz.question == desc; });
        }

        const quizItem = getQuizAnswers(quizQuestion)[0];

        if (quizItem.quiz1 === quizItem.correct) {
            interaction.update({
                embeds: [
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`Correct! The answer was **${quizItem.correct}** and was guessed by **${interaction.user}**!`)
                        .addField("Question", `${quizQuestion}`)
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('quiz1')
                                .setLabel(`${quizItem.quiz1}`)
                                .setDisabled(true)
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('quiz2')
                                .setLabel(`${quizItem.quiz2}`)
                                .setDisabled(true)
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('quiz3')
                                .setLabel(`${quizItem.quiz3}`)
                                .setStyle('DANGER')
                                .setDisabled(true)
                        )
                ]
            }).catch(err => console.log(err));

        } else {
            interaction.update({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`Wrong! The answer was **${quizItem.correct}**! \n**${interaction.user}** entered **${quizItem.quiz1}**!`)
                        .addField("Question", `${quizQuestion}`)
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('quiz1')
                                .setLabel(`${quizItem.quiz1}`)
                                .setDisabled(true)
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('quiz2')
                                .setLabel(`${quizItem.quiz2}`)
                                .setDisabled(true)
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('quiz3')
                                .setLabel(`${quizItem.quiz3}`)
                                .setStyle('DANGER')
                                .setDisabled(true)
                        )
                ]
            }).catch(err => console.log(err));

        }
    }
}