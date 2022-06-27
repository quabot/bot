const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    id: "quiz-1",
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
                });
                newUser.save();
            }
        }).clone().catch((err => { }));

        if (!UserDatabase) return;

        if (quiz.option1 === quiz.answer) {

            interaction.update({
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription(`**${question}**\n${interaction.user} got the correct answer!`)
                        .addFields(
                            { name: "Score", value: `\`${UserDatabase.quizScore + 1}\``, inline: true },
                            { name: "Total Wins", value: `\`${UserDatabase.quizWins + 1}\``, inline: true },
                            { name: "Total Loses", value: `\`${UserDatabase.quizLoses}\``, inline: true }
                        )
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('quiz-1')
                                .setLabel(`${quiz.option1}`)
                                .setStyle('SUCCESS')
                                .setDisabled(true),
                            new MessageButton()
                                .setCustomId('quiz-2')
                                .setLabel(`${quiz.option2}`)
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            new MessageButton()
                                .setCustomId('quiz-3')
                                .setLabel(`${quiz.option3}`)
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                        )
                ]
            }).catch((err => { }));

            await UserDatabase.updateOne({
                quizScore: UserDatabase.quizScore + 1,
                quizWins: UserDatabase.quizWins + 1,
            });

        } else {

            let styleSecond = "SECONDARY";
            let styleThird = "SECONDARY";

            if (quiz.option2 === quiz.answer) styleSecond = "SUCCESS";
            if (quiz.option3 === quiz.answer) styleThird = "SUCCESS";

            interaction.update({
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription(`**${question}**\n${interaction.user} entered the incorrect answer!`)
                        .addFields(
                            { name: "Score", value: `\`${UserDatabase.quizScore - 1}\``, inline: true },
                            { name: "Total Wins", value: `\`${UserDatabase.quizWins}\``, inline: true },
                            { name: "Total Loses", value: `\`${UserDatabase.quizLoses + 1}\``, inline: true }
                        )
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('quiz-1')
                                .setLabel(`${quiz.option1}`)
                                .setStyle('DANGER')
                                .setDisabled(true),
                            new MessageButton()
                                .setCustomId('quiz-2')
                                .setLabel(`${quiz.option2}`)
                                .setStyle(styleSecond)
                                .setDisabled(true),
                            new MessageButton()
                                .setCustomId('quiz-3')
                                .setLabel(`${quiz.option3}`)
                                .setStyle(styleThird)
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
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription("Do you want to play again?")
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('quiz-replay')
                                .setLabel(`Play Again`)
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('quiz-stop')
                                .setLabel(`End Interaction`)
                                .setStyle('SECONDARY'),
                        )
                ]
            }).catch((err => { }))
        }, 1500);
    }
}