const { MessageActionRow, MessageButton } = require('discord.js');

const rpsButton = new MessageActionRow()
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
            .setStyle('SUCCESS'),
    );
const rpsAgain = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('rpsagain')
            .setLabel('Play Again')
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('closeConfig')
            .setLabel('End Interaction')
            .setStyle('SECONDARY'),
    );

module.exports = { rpsButton, rpsAgain };