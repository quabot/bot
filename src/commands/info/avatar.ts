import { SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get an avatar')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Get the avatar of a user.')
                .addUserOption(option =>
                    option.setName('user').setDescription("The user you'd like to see the avatar from!")
                )
        )
        .addSubcommand(subcommand => subcommand.setName('server').setDescription('Get the avatar of the server.'))
        .setDMPermission(false),
    async execute() {},
};
