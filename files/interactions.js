const discord = require('discord.js');

const HelpSelect = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
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
                    value: 'mod_commands',
                },
                {
                    label: 'Misc Commands',
                    description: 'These commands are just general commands that dont fit the descrition of the ones above.',
                    value: 'misc_commands',
                },
            ]),
    );

module.exports = {HelpSelect}