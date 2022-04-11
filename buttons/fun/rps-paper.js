const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    id: "paper",
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
                            .setDescription(`You won! I picked **rock**, ${interaction.user} picked **paper**!`)
                            .setColor("GREEN")
                    ], components: [playAgain]
                }).catch(err => console.log(err));

                break;

            case "paper":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`It's  tie, we both picked paper!`)
                            .setColor(color)
                    ], components: [playAgain]
                }).catch(err => console.log(err));

                break;

            case "scissors":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You lost! I picked **scissors**, ${interaction.user} picked **paper**!`)
                            .setColor("RED")
                    ], components: [playAgain]
                }).catch(err => console.log(err));

                break;
        }
    }
}