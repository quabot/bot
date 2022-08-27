const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const translate = require("translate-google");
const ISO6391 = require("iso-639-1");

module.exports = {
    name: "translate",
    description: "Translate ",
    options: [
        {
            name: "text",
            description: "Text to translate.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "to",
            description: "Language to translate to.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "from",
            description: "Language to translate from.",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    /**
     * @param {import('discord.js').Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        const text = interaction.options.getString("text");
        const fromlanguage = interaction.options.getString("from");
        const tolanguage = interaction.options.getString("to");

        translate(text, { from: fromlanguage, to: tolanguage })
            .then((result) => {

                const oldLanguage =
                    ISO6391.getName(fromlanguage) ||
                    fromlanguage ||
                    "Auto Detected";

                const newLanguage = ISO6391.getName(tolanguage) || tolanguage;

                interaction.editReply({
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
                            .setTimestamp()
                    ]
                }).catch((e => { }));
            }).catch((e => { }));
    }
}