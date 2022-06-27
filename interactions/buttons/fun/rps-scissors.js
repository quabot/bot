const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    id: "rps-scissors",
    execute(interaction, client, color) {

        const validChoices = ['rock', 'paper', 'scissors'];

        switch (validChoices[Math.floor(Math.random() * validChoices.length)]) {
            case "scissors":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`It's a tie! We both picked scissors.`)
                            .setColor(color)
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('rps-replay')
                                    .setLabel('Retry')
                                    .setStyle('PRIMARY'),
                                new MessageButton()
                                    .setCustomId('stop')
                                    .setLabel('Stop')
                                    .setStyle('SECONDARY'),
                            )
                            
                    ]
                }).catch((err => { }))

                break;

            case "rock":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You lost! The correct answer was **paper**, ${interaction.user} picked **scissors**!`)
                            .setColor("RED")
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('rps-replay')
                                    .setLabel('Retry')
                                    .setStyle('PRIMARY'),
                                new MessageButton()
                                    .setCustomId('stop')
                                    .setLabel('Stop')
                                    .setStyle('SECONDARY'),
                            )
                    ]
                }).catch((err => { }))

                break;

            case "rock":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You won! The correct answer was **rock**, ${interaction.user} picked **scissors**!`)
                            .setColor("GREEN")
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('rps-replay')
                                    .setLabel('Retry')
                                    .setStyle('PRIMARY'),
                                new MessageButton()
                                    .setCustomId('stop')
                                    .setLabel('Stop')
                                    .setStyle('SECONDARY'),
                            )
                    ]
                }).catch((err => { }))

                break;
        }
    }
}