const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, Colors } = require('discord.js');

module.exports = {
    id: "rps-rock",
    async execute(interaction, client, color) {

        const validChoices = ['rock', 'paper', 'scissors'];

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

        switch (validChoices[Math.floor(Math.random() * validChoices.length)]) {
            case "rock":
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`It's a tie! We both picked rock.`)
                            .addFields(
                                { name: "Score", value: `\`${UserDatabase.rpsScore}\``, inline: true },
                                { name: "Total Wins", value: `\`${UserDatabase.rpsWins}\``, inline: true },
                                { name: "Total Loses", value: `\`${UserDatabase.rpsLoses}\``, inline: true }
                            )
                            .setColor(color)
                    ], components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('rps-replay')
                                    .setLabel('Retry')
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId('stop')
                                    .setLabel('Stop')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                    ]
                }).catch((err => { }))

                break;

            case "paper":
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`You lost! The correct answer was **paper**, ${interaction.user} picked **rock**!`)
                            .setColor(Colors.Red)
                            .addFields(
                                { name: "Score", value: `\`${UserDatabase.rpsScore - 1}\``, inline: true },
                                { name: "Total Wins", value: `\`${UserDatabase.rpsWins}\``, inline: true },
                                { name: "Total Loses", value: `\`${UserDatabase.rpsLoses + 1}\``, inline: true }
                            )
                    ], components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('rps-replay')
                                    .setLabel('Retry')
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId('stop')
                                    .setLabel('Stop')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                    ]
                }).catch((err => { }));

                await UserDatabase.updateOne({
                    rpsScore: UserDatabase.rpsScore - 1,
                    rpsLoses: UserDatabase.rpsLoses + 1
                });

                break;

            case "scissors":
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`You won! I picked **scissors**, ${interaction.user} picked **rock**!`)
                            .setColor(Colors.Green)
                            .addFields(
                                { name: "Score", value: `\`${UserDatabase.rpsScore + 1}\``, inline: true },
                                { name: "Total Wins", value: `\`${UserDatabase.rpsWins + 1}\``, inline: true },
                                { name: "Total Loses", value: `\`${UserDatabase.rpsLoses}\``, inline: true }
                            )
                    ], components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('rps-replay')
                                    .setLabel('Retry')
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId('stop')
                                    .setLabel('Stop')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                    ]
                }).catch((err => { }));

                await UserDatabase.updateOne({
                    rpsScore: UserDatabase.rpsScore + 1,
                    rpsWins: UserDatabase.rpsWins + 1
                });

                break;
        }
    }
}