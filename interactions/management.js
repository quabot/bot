const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

const configSelect = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: '✅ Toggle Features',
                    description: 'Toggle certain settings like log channels, tickets, music and more.',
                    value: 'toggle_features',
                },
                {
                    label: '📄 Change Channels',
                    description: 'Allows you to change log channel, welcome channel and more channel-related settings.',
                    value: 'change_channels',
                },
                {
                    label: '🗂️ Change Roles',
                    description: 'Allows you to change roles for people who are muted, on join etc.',
                    value: 'change_roles',
                },
                {
                    label: '📝 Logging Settings',
                    description: 'Allows you to toggle logging for certain events.',
                    value: 'event_settings',
                },
                {
                    label: '❓ Other Settings',
                    description: 'Allows you to change other kinds of settings.',
                    value: 'other_settings',
                },
            ]),
    );

module.exports = { configSelect };