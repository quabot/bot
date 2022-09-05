const { Client, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Colors, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "rps",
    description: "Play rock, paper, scissors.",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        const buttons = [
            new ButtonBuilder()
                .setCustomId("rps-rock")
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Rock"),
            new ButtonBuilder()
                .setCustomId("rps-paper")
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Paper"),
            new ButtonBuilder()
                .setCustomId("rps-scissors")
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Scissors"),
        ]

        const message = await interaction.editReply({
            embeds: [await generateEmbed(color, "🪨 Rock, 📃 Paper, ✂️ Scissors")],
            components: [
                new ActionRowBuilder().addComponents(buttons)
            ], fetchReply: true,
        }).catch((e => { }));

        const collector = await message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 20000, filter: ({ user }) => user.id === user.id });
        const validChoices = ['rock', 'paper', 'scissors'];

        const replay = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('rps-replay')
                    .setLabel('Play Again')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('quiz-end')
                    .setLabel('End Interaction')
                    .setStyle(ButtonStyle.Secondary),
            );

        collector.on('collect', async interaction => {

            if (interaction.customId === "rps-rock") {

                switch (validChoices[Math.floor(Math.random() * validChoices.length)]) {
                    case "rock":
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`It's a tie! We both picked **rock**.`)
                                    .setColor(color)
                            ], components: [replay]
                        }).catch((e => { }))

                        break;

                    case "paper":
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`You lost! The correct answer was **paper**, ${interaction.user} picked **rock**!`)
                                    .setColor(Colors.Red)
                            ], components: [replay]
                        }).catch((e => { }));

                        break;

                    case "scissors":
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`You won! I picked **scissors**, ${interaction.user} picked **rock**!`)
                                    .setColor(Colors.Green)
                            ], components: [replay]
                        }).catch((e => { }));

                        break;
                }

            } else if (interaction.customId === "rps-paper") {

                switch (validChoices[Math.floor(Math.random() * validChoices.length)]) {
                    case "rock":
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`You won! You picked **paper**, I picked **rock**.`)
                                    .setColor(Colors.Green)
                            ], components: [replay]
                        }).catch((e => { }))

                        break;

                    case "paper":
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`It's a tie! We both picked **paper**.`)
                                    .setColor(color)
                            ], components: [replay]
                        }).catch((e => { }));

                        break;

                    case "scissors":
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`You lost! I picked **scissors**, ${interaction.user} picked **paper**!`)
                                    .setColor(Colors.Red)
                            ], components: [replay]
                        }).catch((e => { }));

                        break;
                }

            } else {

                switch (validChoices[Math.floor(Math.random() * validChoices.length)]) {
                    case "rock":
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`You lost! You picked **scissors**, I picked **rock**.`)
                                    .setColor(Colors.Red)
                            ], components: [replay]
                        }).catch((e => { }))

                        break;

                    case "paper":
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`You won! You picked **scissors**, i picked **paper**.`)
                                    .setColor(Colors.Green)
                            ], components: [replay]
                        }).catch((e => { }));

                        break;

                    case "scissors":
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`It's a tie! We both picked **scissors**.`)
                                    .setColor(color)
                            ], components: [replay]
                        }).catch((e => { }));

                        break;
                }

            }
        })

        buttons.forEach(b => b.setDisabled(true));
        collector.on('end', async () => {
            await message.edit({
                components: [new ActionRowBuilder().addComponents(buttons)]
            }).catch((e => { }));
        });
    }
}