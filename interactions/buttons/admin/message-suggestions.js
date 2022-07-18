const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    id: "message-suggestions",
    permission: "ADMINISTRATOR",
    async execute(interaction, client, color) {

        //* Implement the suggestion config.
        const SuggestConfig = require('../../../structures/schemas/SuggestionConfigSchema');
        const suggestConfig = await SuggestConfig.findOne({
            guildId: interaction.guild.id,
        }, (err, suggest) => {
            if (err) console.log(err);
            if (!suggest) {
                const newSuggestConfig = new SuggestConfig({
                    guildId: interaction.guild.id,
                    suggestEnabled: true,
                    suggestLogEnabled: true,
                    suggestChannelId: "none",
                    suggestLogChannelId: "none",
                    suggestReasonApproveDeny: false,
                    suggestEmojiSet: "default"
                });
                newSuggestConfig.save();
            }
        }).clone().catch((err => { }));

        if (!suggestConfig) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`We just created a new database record! Please run that command again!`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        if (!suggestConfig.suggestEnabled) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Suggestions are disabled in this server. Ask an admin to enable them on our [dashboard](https://dashboard.quabot.net).")
            ], ephemeral: true
        }).catch((err => { }));


        //* Get the suggestion channel.
        const suggestChannel = await interaction.guild.channels.cache.get(`${suggestConfig.suggestChannelId}`);

        if (!suggestChannel) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Couldn't find a suggestion channel. Configure this on our [dashboard](https://dashboard.quabot.net).")
            ], ephemeral: true
        }).catch((err => { }));


        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("You can dismiss this message.")
            ], ephemeral: true
        }).catch((err => { }));

        interaction.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle("Create suggestion")
                    .setDescription("Click on the button below this message to leave a suggestion.")
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("create-suggestion")
                            .setStyle("SECONDARY")
                            .setLabel("💡 Suggest")
                    )
            ]
        }).catch((err => { }));

    }
}