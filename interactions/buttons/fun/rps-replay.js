const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    id: "rps-replay",
    execute(interaction, client, color) {

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Rock, paper, scissors?`)
                    .setColor(color)
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('rps-rock')
                            .setLabel('🪨 Rock')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('rps-paper')
                            .setLabel('📃 Paper')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('rps-scissors')
                            .setLabel('✂️ Scissors')
                            .setStyle('SUCCESS')
                    )
            ]
        }).catch((err => console.log(err)));
        
    }
}