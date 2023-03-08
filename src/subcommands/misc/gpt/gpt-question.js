const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

module.exports = {
    parent: 'gpt',
    name: 'question',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        const question = interaction.options.getString('question-content');

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Processing...')
            ]
        });


        try {
            const response = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: question,
                max_tokens: 2048,
                temperature: 0.5
            });

            await interaction.editReply({ 
                embeds: [
                    new Embed(color)    
                    .setTitle(question)
                    .setDescription(response.data.choices[0].text)
                ]
             });

        } catch (error) {
            console.log(error)
            await interaction.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription('Failed to get a response from Chat-GPT, please try again later.')
                ]
            });
        }
    }
};
