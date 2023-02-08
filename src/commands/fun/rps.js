const {
    SlashCommandBuilder,
    Client,
    CommandInteraction,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");
const {Embed} = require("../../utils/constants/embed");
const {getUserGame} = require("../../utils/configs/userGame");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play rock, paper, scissors.')
        .setDMPermission(false),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        await getUserGame(interaction.user.id);

        const msg = await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('Rock, paper or scissors?')
            ], components: [
                new ActionRowBuilder()
                    .setComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel('Rock')
                            .setEmoji('🪨')
                            .setCustomId('rock'),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel('Paper')
                            .setEmoji('📄')
                            .setCustomId('paper'),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel('Scissors')
                            .setEmoji('✂️')
                            .setCustomId('scissors')
                    )
            ], fetchReply: true
        });

        const collector = msg.createMessageComponentCollector({
            time: 60000
        });

        const userDB = await getUserGame(interaction.user.id);

        collector.on('collect', async interaction => {
            collector.stop();


            userDB.rpsTries += 1;

            const options = ['rock', 'paper', 'scissors'];
            const myChoice = options[Math.floor(Math.random() * options.length)];
            let userChoice = interaction.customId;

            const choices = {
                rock: {weakTo: 'paper', strongTo: 'scissors'},
                paper: {weakTo: 'scissors', strongTo: 'rock'},
                scissors: {weakTo: 'rock', strongTo: 'paper'}
            }

            if (choices[myChoice].strongTo === userChoice) {
                await interaction.update({
                    embeds: [
                        new Embed(color)
                            .setDescription(`I picked **${myChoice}** and you picked **${userChoice}**, so i won and you lost!`)
                            .addFields(
                                {name: 'Your Score', value: `${userDB.rpsPoints - 1}`, inline: true},
                                {name: 'Entered By', value: `${interaction.user}`, inline: true}
                            )
                    ], components: [
                        new ActionRowBuilder()
                            .setComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel('Play Again')
                                    .setCustomId('rps-replay')
                            )
                    ]
                });

                userDB.rpsPoints -= 1;
                await userDB.save();
            } else if (choices[myChoice].weakTo === userChoice) {
                await interaction.update({
                    embeds: [
                        new Embed(color)
                            .setDescription(`I picked **${myChoice}** and you picked **${userChoice}**, so you won!`)
                            .addFields(
                                {name: 'Your Score', value: `${userDB.rpsPoints + 1}`, inline: true},
                                {name: 'Entered By', value: `${interaction.user}`, inline: true}
                            )
                    ], components: [
                        new ActionRowBuilder()
                            .setComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel('Play Again')
                                    .setCustomId('rps-replay')
                            )
                    ]
                });

                userDB.rpsPoints += 1;
                await userDB.save();
            } else {
                await interaction.update({
                    embeds: [
                        new Embed(color)
                            .setDescription(`I picked **${myChoice}** and you picked **${userChoice}**, so it's a tie!`)
                            .addFields(
                                {name: 'Your Score', value: `${userDB.rpsPoints}`, inline: true},
                                {name: 'Entered By', value: `${interaction.user}`, inline: true}
                            )
                    ], components: [
                        new ActionRowBuilder()
                            .setComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel('Play Again')
                                    .setCustomId('rps-replay')
                            )
                    ]
                });

                await userDB.save();
            }
        });


        collector.on('end', async () => {
            await interaction.editReply({
                components: [
                    new ActionRowBuilder()
                        .setComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel('Play Again')
                                .setCustomId('rps-replay')
                        )
                ]
            });
        });
    }
}