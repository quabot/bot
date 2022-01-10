const discord = require('discord.js');

const main = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddstart')
            .setLabel('Start Configuration')
            .setEmoji('✅')
            .setStyle('PRIMARY'),
    );
const mainDisabled = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddstart')
            .setLabel('Start Configuration')
            .setEmoji('✅')
            .setDisabled(true)
            .setStyle('PRIMARY'),
    );
const stepOneToggle = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddoneenable')
            .setLabel('Enable Logs')
            .setStyle('SUCCESS'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddonedisable')
            .setLabel('Disable Logs')
            .setStyle('DANGER'),
    );
const stepOneDisabled = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddoneenable')
            .setLabel('Enable Logs')
            .setDisabled(true)
            .setStyle('SUCCESS'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddonedisable')
            .setLabel('Disable Logs')
            .setDisabled(true)
            .setStyle('DANGER'),
    );
const stepTwoToggle = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddtwoenable')
            .setLabel('Enable Welcome Messages')
            .setStyle('SUCCESS'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddtwodisable')
            .setLabel('Disable Welcome Messages')
            .setStyle('DANGER'),
    );
const stepTwoToggleDisabled = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddtwoenable')
            .setLabel('Enable Welcome Messages')
            .setDisabled(true)
            .setStyle('SUCCESS'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddtwodisable')
            .setLabel('Disable Welcome Messages')
            .setDisabled(true)
            .setStyle('DANGER'),
    );
const stepTwoToggleTwoDisabled = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddtoenable')
            .setLabel('Enable Join Roles')
            .setDisabled(true)
            .setStyle('SUCCESS'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddtodisable')
            .setLabel('Disable Join Roles')
            .setDisabled(true)
            .setStyle('DANGER'),
    );
const stepTwoToggleTwo = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddtoenable')
            .setLabel('Enable Join Roles')
            .setStyle('SUCCESS'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddtodisable')
            .setLabel('Disable Join Roles')
            .setStyle('DANGER'),
    );
const stepThreeTD = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddthreedisable')
            .setLabel('Enable Tickets')
            .setDisabled(true)
            .setStyle('SUCCESS'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddthreeenable')
            .setLabel('Disable Tickets')
            .setDisabled(true)
            .setStyle('DANGER'),
    );
const stepThreeT = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddthreeenable')
            .setLabel('Enable Tickets')
            .setStyle('SUCCESS'),
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId('botaddthreedisable')
            .setLabel('Disable Tickets')
            .setStyle('DANGER'),
    );

module.exports = { stepThreeTD, stepThreeT, stepTwoToggleTwoDisabled, stepTwoToggleTwo, stepTwoToggleTwoDisabled, main, mainDisabled, stepOneToggle, stepOneDisabled, stepTwoToggle, stepTwoToggleDisabled }