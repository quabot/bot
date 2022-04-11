const discord = require('discord.js');

const playButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('pause-song')
            .setLabel('Pause')
            .setEmoji('⏯️')
            .setStyle('SECONDARY'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('skip-song')
            .setLabel('Skip')
            .setEmoji('⏭️')
            .setStyle('SECONDARY'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('stop-song')
            .setLabel('Stop')
            .setEmoji('⏹️')
            .setStyle('SECONDARY'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('shuffle-song')
            .setLabel('Shuffle')
            .setEmoji('🔀')
            .setStyle('SECONDARY'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('repeat-song')
            .setLabel('Repeat')
            .setEmoji('🔁')
            .setStyle('SECONDARY'),
    )
const pausedButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('resume-song')
            .setLabel('Resume')
            .setEmoji('▶️')
            .setStyle('SECONDARY'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('skip-song')
            .setLabel('Skip')
            .setEmoji('⏭️')
            .setStyle('SECONDARY'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('stop-song')
            .setLabel('Stop')
            .setEmoji('⏹️')
            .setStyle('SECONDARY'),
    )

const skipButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('pause-song')
            .setLabel('Pause')
            .setEmoji('⏯️')
            .setStyle('SECONDARY'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('skip-song')
            .setLabel('Skip')
            .setEmoji('⏭️')
            .setStyle('SECONDARY'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('stop-song')
            .setLabel('Stop')
            .setEmoji('⏹️')
            .setStyle('SECONDARY'),
    )


module.exports = { skipButtons, pausedButtons, playButtons, skipButtons }