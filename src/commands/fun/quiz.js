const { SlashCommandBuilder, Client, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");
const axios = require('axios');
const { shuffleArray } = require("../../utils/functions/array");
const { getUserGame } = require("../../utils/configs/userGame");

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
                .setCustomId(`${answers.indexOf(answer)}`)
                .setLabel(answer.replaceAll('&amp;', '&').replaceAll('&reg;', '®').replaceAll('&#039;', '\'').replaceAll('&quot;', '"'))
                .setStyle(ButtonStyle.Secondary);

            row.addComponents(button);
        });

        const message = await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription(`${question.question}`.replaceAll('&amp;', '&').replaceAll('&reg;', '®').replaceAll('&quot;', '"').replaceAll('&#039;', '\''))
            ], components: [row], fetchReply: true
        });

        const collector = message.createMessageComponentCollector({
            time: 60000
        });


        collector.on('collect', async interaction => {
            const userDB = await getUserGame(interaction.user.id);
            if (userDB) userDB.quizTries += 1;

            const answeredAnswer = answers[parseInt(interaction.customId)];
            if (!answeredAnswer) return interaction.reply('There was an error.');
            if (answeredAnswer === question.correct_answer) {
                const row2 = new ActionRowBuilder();
                answers.forEach(answer => {
                    const button = new ButtonBuilder()
                        .setCustomId(`${answers.indexOf(answer)}`)
                        .setLabel(answer.replaceAll('&quot;', '"').replaceAll('&#039;', '\'').replaceAll('&amp;', '&').replaceAll('&reg;', '®'))
                        .setStyle(answer === question.correct_answer ? ButtonStyle.Success : ButtonStyle.Secondary)
                        .setDisabled(true);

                    row2.addComponents(button);
                });

                await interaction.update({
                    embeds: [
                        new Embed(Colors.Green)
                            .setDescription(`**Correct**\n${question.question}\n**Answered by:** ${interaction.user}\n**Points:** ${userDB ? userDB.quizPoints + 1 : 0}`.replaceAll('&amp;', '&').replaceAll('&reg;', '®').replaceAll('&#039;', '\'').replaceAll('&quot;', '"'))
                    ], components: [row2]
                });

                if (userDB) userDB.quizPoints += 1;
                if (userDB) await userDB.save();
            } else {
                const row2 = new ActionRowBuilder();
                answers.forEach(answer => {
                    const button = new ButtonBuilder()
                        .setCustomId(`${answers.indexOf(answer)}`)
                        .setLabel(answer.replaceAll('&quot;', '"').replaceAll('&amp;', '&').replaceAll('&reg;', '®').replaceAll('&#039;', '\''))
                        .setStyle(answer === question.correct_answer ? ButtonStyle.Success : (answers.indexOf(answer) === parseInt(interaction.customId) ? ButtonStyle.Danger : ButtonStyle.Secondary))
                        .setDisabled(true);

                    row2.addComponents(button);
                });

                await interaction.update({
                    embeds: [
                        new Embed(Colors.Red)
                            .setDescription(`**Incorrect**\n${question.question}\n**Correct Answer:** ${question.correct_answer}\n**Answered by:** ${interaction.user}\n**Points:** ${userDB ? userDB.quizPoints - 1 : 0}`.replaceAll('&#039;', '\'').replaceAll('&amp;', '&').replaceAll('&reg;', '®').replaceAll('&quot;', '"'))
                    ], components: [row2]
                });

                if (userDB) userDB.quizPoints -= 1;
                if (userDB) await userDB.save();
            }
        });
    }
}