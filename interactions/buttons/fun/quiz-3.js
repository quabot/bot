const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle } = require('discord.js');

module.exports = {
    id: "quiz-3",
    async execute(interaction, client, color) {

        const quizQuestions = require('../../../structures/files/quiz.json');

        const question = interaction.message.embeds[0].description;

        const quiz = quizQuestions.find(q => q.question === question);

        const User = require('../../../structures/schemas/UserSchema');
        const UserDatabase = await User.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        }, (err, user) => {
            if (err) console.log(err);
            if (!user) {
                const newUser = new User({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    quizScore: 0,
                    quizWins: 0,
                    quizLoses: 0,
                    typeScore: 0,
                    typeWins: 0,
                    typeLoses: 0,
                    rpsScore: 0,
                    rpsWins: 0,
                    rpsLoses: 0,
                });
                newUser.save();
            }
        }).clone().catch((err => { }));

        if (!UserDatabase) return;

        if (quiz.option3 === quiz.answer) {

            interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setDescription(`**${question}**\n${interaction.user} got the correct answer!`)
                        .addFields(
                            { name: "Score", value: `\`${UserDatabase.quizScore + 1}\``, inline: true },
                            { name: "Total Wins", value: `\`${UserDatabase.quizWins + 1}\``, inline: true },
                            { name: "Total Loses", value: `\`${UserDatabase.quizLoses}\``, inline: true }
                        )
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('quiz-1')
                                .setLabel(`${quiz.option1}`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('quiz-2')
                                .setLabel(`${quiz.option2}`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('quiz-3')
                                .setLabel(`${quiz.option3}`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        )
                ]
            }).catch((err => { }));

            await UserDatabase.updateOne({
                quizScore: UserDatabase.quizScore + 1,
                quizWins: UserDatabase.quizWins + 1,
            });

        } else {

            let styleFirst = quiz.option1 === quiz.answer ? ButtonStyle.Success : ButtonStyle.Secondary;
            let styleSecond = quiz.option2 === quiz.answer ? ButtonStyle.Success : ButtonStyle.Secondary;

            interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`**${question}**\n${interaction.user} entered the incorrect answer!`)
                        .addFields(
                            { name: "Score", value: `\`${UserDatabase.quizScore - 1}\``, inline: true },
                            { name: "Total Wins", value: `\`${UserDatabase.quizWins}\``, inline: true },
                            { name: "Total Loses", value: `\`${UserDatabase.quizLoses + 1}\``, inline: true }
                        )
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('quiz-1')
                                .setLabel(`${quiz.option1}`)
                                .setStyle(styleFirst)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('quiz-2')
                                .setLabel(`${quiz.option2}`)
                                .setStyle(styleSecond)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('quiz-3')
                                .setLabel(`${quiz.option3}`)
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true),
                        )
                ]
            }).catch((err => { }));

            await UserDatabase.updateOne({
                quizScore: UserDatabase.quizScore - 1,
                quizLoses: UserDatabase.quizLoses + 1,
            });
        }

        setTimeout(() => {
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setDescription("Do you want to play again?")
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('quiz-replay')
                                .setLabel(`Play Again`)
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId('stop')
                                .setLabel(`End Interaction`)
                                .setStyle(ButtonStyle.Secondary),
                        )
                ]
            }).catch((err => { }))
        }, 1500);
    }
}