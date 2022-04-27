const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    id: "scissors",
    execute(interaction, client, color) {

        const playAgain = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rpsAgain')
                    .setLabel('Retry')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rpsClose')
                    .setLabel('Stop')
                    .setStyle('SECONDARY'),
            );

        const validChoices = ['rock', 'paper', 'scissors'];

        switch (validChoices[Math.floor(Math.random() * validChoices.length)]) {
            case "scissors":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`It's a tie! We both picked scissors.`)
                            .setColor(color)
                    ], components: [playAgain]
                }).catch(err => console.log(err));

                break;

            case "rock":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You lost! The correct answer was **paper**, ${interaction.user} picked **scissors**!`)
                            .setColor("RED")
                    ], components: [playAgain]
                }).catch(err => console.log(err));

                break;

            case "rock":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You won! The correct answer was **rock**, ${interaction.user} picked **scissors**!`)
                            .setColor("GREEN")
                    ], components: [playAgain]
                }).catch(err => console.log(err));

                break;
        }
    }
}