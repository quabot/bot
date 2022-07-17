const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "rps",
    command: "games",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Rock, paper, scissors?`)
                    .setColor(color)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('rps-rock')
                            .setLabel('🪨 Rock')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('rps-paper')
                            .setLabel('📃 Paper')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('create-ticket')
                            .setLabel('✂️ Scissors')
                            .setStyle(ButtonStyle.Success)
                    )
            ]
        }).catch((err => { }));

    }
}