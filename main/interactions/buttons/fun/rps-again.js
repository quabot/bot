const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    id: "rpsAgain",
    execute(interaction, client, color) {

        interaction.update({
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('rpsAgain')
                            .setDisabled(true)
                            .setLabel('Retry')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('rpsClose')
                            .setLabel('Stop')
                            .setDisabled(true)
                            .setStyle('SECONDARY'),
                    )
            ]
        }).catch(( err => { } ))

        interaction.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Rock, paper, scissors?`)
                    .setColor(color)
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('rock')
                            .setLabel('🪨 Rock')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('paper')
                            .setLabel('📃 Paper')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('scissors')
                            .setLabel('✂️ Scissors')
                            .setStyle('SUCCESS')
                    )
            ]
        }).catch(( err => { } ))
    }
}