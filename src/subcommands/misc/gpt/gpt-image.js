const { ChatInputCommandInteraction, Client, ColorResolvable, codeBlock } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

module.exports = {
    parent: 'gpt',
    name: 'image',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        const image = interaction.options.getString('image-content');

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Processing...')
            ]
        });


        try {
            const response = await openai.createImage({
                prompt: image,
                n: 1,
                size: '1024x1024',
            });

            await interaction.editReply({ content: response.data.data[0].url });
        } catch (error) {
            await interaction.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription('Failed to get a response from Chat-GPT, please try again later.')
                ]
            });
        }
    }
};
