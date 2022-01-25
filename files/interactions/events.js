const discord = require('discord.js');

const buttonsJoin = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableJoinMsg')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableJoinMsg')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const buttonsLeave = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableLeaveMsg')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableLeaveMsg')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );

module.exports = {
    buttonsJoin,
    buttonsLeave,
}