const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue-times')
        .setDescription('Get the queue times for a theme park ride.')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List the available parks/rides.')
                .addStringOption(option =>
                    option
                        .setName('country')
                        .setRequired(false)
                        .setDescription('See all the available parks in this country.')
                )
                .addStringOption(option =>
                    option
                        .setName('park')
                        .setRequired(false)
                        .setDescription('See all the available rides in this park.')
                )
                .addStringOption(option =>
                    option
                        .setName('owner')
                        .setRequired(false)
                        .setDescription('See all the available parks from this owner.')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View the queue times in a park.')
                .addStringOption(option =>
                    option.setName('park').setRequired(true).setDescription('The park that the ride is in.')
                )
                .addStringOption(option =>
                    option
                        .setName('attraction')
                        .setRequired(false)
                        .setDescription('The ride to view the queue times of.')
                )
        ),
    async execute() {},
};
