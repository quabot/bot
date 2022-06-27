const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    id: "rps-rock",
    execute(interaction, client, color) {

        const validChoices = ['rock', 'paper', 'scissors'];

        switch (validChoices[Math.floor(Math.random() * validChoices.length)]) {
            case "rock":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`It's a tie! We both picked rock.`)
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

            case "paper":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You lost! The correct answer was **paper**, ${interaction.user} picked **rock**!`)
                            .setColor("RED")
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('rps-again')
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
                            .setDescription(`You won! I picked **scissors**, ${interaction.user} picked **rock**!`)
                            .setColor("RED")
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('rps-again')
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