const discord = require('discord.js');

const close = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('close')
            .setLabel('Close')
            .setEmoji('🔒')
            .setStyle('SUCCESS'),
    );
const deleteConfirm = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('deleteconfirm')
            .setLabel('Delete')
            .setEmoji('⛔')
            .setStyle('PRIMARY'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('deletecancel')
            .setLabel('Cancel')
            .setEmoji('❌')
            .setStyle('DANGER'),
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
const closed = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('transcript')
            .setLabel('Transcript')
            .setEmoji('📝')
            .setStyle('PRIMARY'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('reopen')
            .setLabel('Re-open')
            .setEmoji('🔓')
            .setStyle('SUCCESS'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('delete')
            .setLabel('Delete')
            .setEmoji('⛔')
            .setStyle('DANGER'),
    );

module.exports = { deleteConfirm, closed, closeConfirm, close }