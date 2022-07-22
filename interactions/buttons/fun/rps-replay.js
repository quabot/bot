const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    id: "rps-replay",
    execute(interaction, client, color) {

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
                            .setCustomId('rps-scissors')
                            .setLabel('✂️ Scissors')
                            .setStyle(ButtonStyle.Success)
                    )
            ]
        }).catch((err => console.log(err)));
        
    }
}