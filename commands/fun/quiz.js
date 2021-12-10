const discord = require("discord.js");

const colors = require('../../files/colors.json');
const quiz = require('../../validation/quiz.json');
const { errorMain, addedDatabase, QuizSentenceNone } = require('../../files/embeds');

module.exports = {
    name: "quiz",
    description: "Play a nice quiz.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            const item = quiz[Math.floor(Math.random() * quiz.length)];

            const author = interaction.user;
            if (!item) return interaction.reply({ embeds: [QuizSentenceNone] });

            const quizButtons = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId('answer1')
                        .setLabel(`${item.answer1}`)
                        .setStyle('SUCCESS'),
                    new discord.MessageButton()
                        .setCustomId('answer2')
                        .setLabel(`${item.answer2}`)
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId('answer3')
                        .setLabel(`${item.answer3}`)
                        .setStyle('DANGER'),
                );

            const embed = new discord.MessageEmbed()
                .setTitle("Answer this question")
                .setDescription(`${item.question}`)
                .setTimestamp()
                .setColor(colors.COLOR);
            interaction.reply({ embeds: [embed], components: [quizButtons] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] });
            console.log(e)
        }
    }
}