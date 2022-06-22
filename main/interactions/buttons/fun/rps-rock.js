const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    id: "rock",
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
            case "rock":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`It's a tie! We both picked rock.`)
                            .setColor(color)
                    ], components: [playAgain]
                }).catch(( err => { } ))

                break;

            case "paper":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You lost! The correct answer was **paper**, ${interaction.user} picked **rock**!`)
                            .setColor("RED")
                    ], components: [playAgain]
                }).catch(( err => { } ))

                break;

            case "scissors":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You won! I picked **scissors**, ${interaction.user} picked **rock**!`)
                            .setColor("RED")
                    ], components: [playAgain]
                }).catch(( err => { } ))

                break;
        }
    }
}