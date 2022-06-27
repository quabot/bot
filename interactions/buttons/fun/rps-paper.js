const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    id: "rps-paper",
    execute(interaction, client, color) {

        const validChoices = ['rock', 'paper', 'scissors'];

        switch (validChoices[Math.floor(Math.random() * validChoices.length)]) {
            case "rock":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You won! I picked **rock**, ${interaction.user} picked **paper**!`)
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

            case "paper":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`It's  tie, we both picked paper!`)
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

            case "scissors":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You lost! I picked **scissors**, ${interaction.user} picked **paper**!`)
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
                            )]
                }).catch((err => { }))

                break;
        }
    }
}