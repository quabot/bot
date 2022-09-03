const { Client, Interaction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Suggest = require('../../../structures/schemas/SuggestConfigSchema');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    id: "suggestion-create",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        let suggestConfig;

        if (client.cache.get(`${interaction.guildId}-suggest-config`)) suggestConfig = client.cache.get(`${interaction.guildId}-suggest-config`);
        if (!suggestConfig) suggestConfig = await Suggest.findOne({
            guildId: interaction.guildId,
        }, (err, suggest) => {
            if (err) console.error(err);
            if (!suggest) {
                const newSuggest = new Suggest({
                    guildId: interaction.guildId,
                    suggestEnabled: true,
                    suggestLogEnabled: true,
                    suggestChannelId: "none",
                    suggestLogChannelId: "none",
                    suggestReasonApproveDeny: true,
                    suggestEmojiSet: "default",
                });
                newSuggest.save()
                    .catch(err => {
                        console.log(err);
                    });
            }
        }).clone().catch(function (err) { });

        client.cache.set(`${interaction.guildId}-suggest-config`, suggestConfig, 10000);


        if (!suggestConfig) return interaction.reply({
            embeds: [await generateEmbed(color, "A config is being generated, please run the command again.")],
            ephemeral: true
        }).catch(() => null);

        if (suggestConfig.suggestEnabled === false) return interaction.reply({
            embeds: [await generateEmbed(color, "Suggestions are not enabled in this server.")],
            ephemeral: true
        }).catch(() => null);


        const modal = new ModalBuilder()
            .setCustomId("create-suggestion")
            .setTitle("Leave a suggestion")
            .setComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("suggestion")
                            .setLabel("Suggestion")
                            .setMaxLength(2000)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder("More voice channels!")
                    )
            );

        await interaction.showModal(modal).catch(() => null);
    }
}