const { MessageActionRow, MessageButton } = require('discord.js')

const buttonsLevels = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableLevel')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableLevel')
            .setLabel('Disable')
            .setStyle('DANGER'),
        new MessageButton()
            .setCustomId('closeConfig')
            .setLabel('Close Menu')
            .setStyle('SECONDARY'),
    );

const buttonsSwear = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableSwear')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableSwear')
            .setLabel('Disable')
            .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('closeConfig')
                .setLabel('Close Menu')
                .setStyle('SECONDARY'),
    );

const buttonsLogs = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableLogs')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableLogs')
            .setLabel('Disable')
            .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('closeConfig')
                .setLabel('Close Menu')
                .setStyle('SECONDARY'),
    );

const buttonsRole = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableRole')
            .setLabel('Enable')
            .setDisabled(false)
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableRole')
            .setLabel('Disable')
            .setDisabled(false)
            .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('closeConfig')
                .setLabel('Close Menu')
                .setStyle('SECONDARY'),
    );

const buttonsMusic = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableMusic')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableMusic')
            .setLabel('Disable')
            .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('closeConfig')
                .setLabel('Close Menu')
                .setStyle('SECONDARY'),
    );

const buttonsReport = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableReport')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableReport')
            .setLabel('Disable')
            .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('closeConfig')
                .setLabel('Close Menu')
                .setStyle('SECONDARY'),
    );

const buttonsSuggest = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableSuggest')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableSuggest')
            .setLabel('Disable')
            .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('closeConfig')
                .setLabel('Close Menu')
                .setStyle('SECONDARY'),
    );

const buttonsTicket = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableTicket')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableTicket')
            .setLabel('Disable')
            .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('closeConfig')
                .setLabel('Close Menu')
                .setStyle('SECONDARY'),
    );

const buttonsWelcome = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableWelcome')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableWelcome')
            .setLabel('Disable')
            .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('closeConfig')
                .setLabel('Close Menu')
                .setStyle('SECONDARY'),
    );

const buttonsPoll = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enablePoll')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disablePoll')
            .setLabel('Disable')
            .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('closeConfig')
                .setLabel('Close Menu')
                .setStyle('SECONDARY'),
    );

const buttonsLevel = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('disablelevel')
            .setLabel('Disable Level-up channel')
            .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('closeConfig')
                .setLabel('Close Menu')
                .setStyle('SECONDARY'),
    );


module.exports = { buttonsSwear, buttonsLevel, buttonsLevels, buttonsLogs, buttonsRole, buttonsMusic, buttonsReport, buttonsSuggest, buttonsTicket, buttonsWelcome, buttonsPoll }