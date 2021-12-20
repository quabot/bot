const discord = require('discord.js');

const close = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
        .setCustomId('close')
        .setLabel('Close')
        .setEmoji('🔒')
        .setStyle('SUCCESS'),
    );
const closeConfirm = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
        .setCustomId('closeconfirm')
        .setLabel('Close')
        .setEmoji('🔒')
        .setStyle('SUCCESS'),
    )
    .addComponents(
        new discord.MessageButton()
        .setCustomId('closecancel')
        .setLabel('Cancel')
        .setEmoji('❌')
        .setStyle('DANGER'),
    );

module.exports = { closeConfirm }