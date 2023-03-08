const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gpt')
        .setDescription('Ask Chat-GPT for an answer or question!')
        .addSubcommand(subcommand => subcommand.setName('question')
            .setDescription('Ask a question to Chat-GPT')
            .addStringOption(option => option.setName('question-content')
                .setDescription('What is your question?')
                .setRequired(true)),
        )
        .addSubcommand(subcommand => subcommand.setName('image')
            .setDescription('Generate an image with Chat-GPT.')
            .addStringOption(option => option.setName('image-content')
                .setDescription('What should be generated?')
                .setRequired(true)),
        ),
    /**
     * @param {import('discord.js').Interaction} interaction
     */
    async execute(client, interaction, color) { },
};
