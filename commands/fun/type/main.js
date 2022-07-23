const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, PermissionFlagsBits } = require('discord.js');
const typeSentences = require('../../../structures/files/type.json');

module.exports = {
    name: "type",
    description: "Play a typing game.",
    permissions: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
    async execute(client, interaction, color) {

        const sentence = typeSentences[Math.floor(Math.random() * typeSentences.length)];
        const startTime = new Date().getTime();

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

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Type this sentence within 10 seconds!**\n\`${sentence}\``)
                    .setColor(color)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('stop')
                            .setLabel('Stop')
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        }).catch((err => { }));

        const filter = m => m.author === interaction.user;
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

        collector.on('collect', async m => {
            const seconds = new Date(new Date().getTime() - startTime).getSeconds();
            collector.stop();

            if (m.content === sentence) {
                m.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`**Correct!**\n${m.author} typed the sentence in \`${seconds}\` seconds!`)
                            .addFields(
                                { name: "Sentence", value: `\`${sentence}\`` },
                                { name: "Score", value: `${UserDatabase.typeScore + 1}`, inline: true },
                                { name: "Total Wins", value: `${UserDatabase.typeWins + 1}`, inline: true },
                                { name: "Total Loses", value: `${UserDatabase.typeLoses}`, inline: true },
                            )
                            .setColor(Colors.Green)
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('type-replay')
                                    .setLabel('Play Again')
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    ]
                }).catch((err => { }));

                await UserDatabase.updateOne({
                    typeScore: UserDatabase.typeScore + 1,
                    typeWins: UserDatabase.typeWins + 1,
                });

            } else {
                m.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`**Incorrect!**\n${m.author} failed to type the correct sentence in \`${seconds}\` seconds!`)
                            .addFields(
                                { name: "Score", value: `${UserDatabase.typeScore - 1}`, inline: true },
                                { name: "Total Wins", value: `${UserDatabase.typeWins}`, inline: true },
                                { name: "Total Loses", value: `${UserDatabase.typeLoses + 1}`, inline: true },
                                { name: "Sentence", value: `\`${sentence}\``, inline: true },
                                { name: "Their Answer", value: `\`${m.content}\``, inline: true },
                            )
                            .setColor(Colors.Red)
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('type-replay')
                                    .setLabel('Play Again')
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    ]
                }).catch((err => { }));

                await UserDatabase.updateOne({
                    typeScore: UserDatabase.typeScore - 1,
                    typeLoses: UserDatabase.typeLoses + 1,
                })
            }
        });

    }
}
