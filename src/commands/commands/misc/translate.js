const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const translate = require('translate-google');
const ISO6391 = require('iso-639-1');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate text from one language to another.')
        .addStringOption(option => option.setName('text').setDescription('Text to translate.').setRequired(true))
        .addStringOption(option => option.setName('to').setDescription('Language to translate to.').setRequired(true))
        .addStringOption(option =>
            option.setName('from').setDescription('Language to translate from.').setRequired(false)
        )
        .setDMPermission(false),
    /**
     * @param {import('discord.js').Interaction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply().catch(e => {});

        const text = interaction.options.getString('text');
        const fromlanguage = interaction.options.getString('from');
        const tolanguage = interaction.options.getString('to');

        translate(text, { from: fromlanguage, to: tolanguage })
            .then(result => {
                const oldLanguage = ISO6391.getName(fromlanguage) || fromlanguage || 'Auto Detected';

                const newLanguage = ISO6391.getName(tolanguage) || tolanguage;

                interaction
                    .editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setDescription(`**Text Translated**\nFrom: **${oldLanguage}**\nTo: **${newLanguage}**`)

                                .addFields(
                                    {
                                        name: `Text`,
                                        value: `${text.slice(0, 1024)}`,
                                    },
                                    {
                                        name: `Translation:`,
                                        value: `${result.slice(0, 1024)}`,
                                    }
                                )
                                .setTimestamp(),
                        ],
                    })
                    .catch(e => {});
            })
            .catch(e => {});
    },
};
