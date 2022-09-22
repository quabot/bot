const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Get images from any subreddit.')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('cat')
                .setDescription('Get a cat image.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('dog')
                .setDescription('Get a dog image.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('meme')
                .setDescription('Get a random meme.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('subreddit')
                .addStringOption(option =>
                    option.setName('reddit')
                        .setDescription('The subreddit to look through.')
                        .setRequired(true))
                .setDescription('Get an image from a subreddit.')),
    async execute() { }
}