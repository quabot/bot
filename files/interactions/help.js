const { MessageActionRow, MessageSelectMenu } = require('discord.js');

const HelpSelect = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Fun Commands',
                    description: 'These commands give funny pictures, games and more.',
                    value: 'fun_commands',
                },
                {
                    label: 'Info Commands',
                    description: 'These commands are used to get information about loads of different things.',
                    value: 'info_commands',
                },
                {
                    label: 'Music Commands',
                    description: 'These commands allow you to play music in your voice channel using youtube videos.',
                    value: 'music_commands',
                },
                {
                    label: 'Moderation Commands',
                    description: 'These commands are used to punish users and moderate the server.',
                    value: 'moder_commands',
                },
                {
                    label: 'Management Commands',
                    description: 'These commands are used by managers to clear channels, start giveaways and more.',
                    value: 'mang_commands',
                },
                {
                    label: 'Misc Commands',
                    description: 'These commands are for commands that don\'t fit another category.',
                    value: 'misc_commands',
                },
                {
                    label: 'Support Commands',
                    description: 'With these commands users can seek support.',
                    value: 'support_commands',
                },
            ]),
    );

module.exports = { HelpSelect }