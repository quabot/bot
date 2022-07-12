const { MessageEmbed } = require('discord.js');

module.exports = {
    id: "suggestion",
    async execute(interaction, client, color) {

        const suggestion = interaction.fields.getTextInputValue('suggestion-box');

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
                new MessageEmbed()
                    .setDescription(`We just created a new database record! Please run that command again!`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        if (!suggestConfig.suggestEnabled) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Suggestions are disabled in this server. Ask an admin to enable them on our [dashboard](https://dashboard.quabot.net).")
            ], ephemeral: true
        }).catch((err => { }));


        //* Get the suggestion channel.
        const suggestChannel = await interaction.guild.channels.cache.get(`${suggestConfig.suggestChannelId}`);

        if (!suggestChannel) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Couldn't find a suggestion channel. Configure this on our [dashboard](https://dashboard.quabot.net).")
            ], ephemeral: true
        }).catch((err => { }));

        const msg = await suggestChannel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle("New Suggestion")
                    .setDescription(`${suggestion}`)
                    .setColor("GREEN")
                    .addField("Suggested By", `${interaction.user}`)
                    .setTimestamp()
            ]
        }).catch((err => { }));

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Successfully left your suggestion. Check it out in ${suggestChannel}`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));


        // repply
        //logging
        // create db

    }
}