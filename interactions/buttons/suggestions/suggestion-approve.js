const { MessageEmbed } = require('discord.js');

module.exports = {
    //! ADMIN PERMISSION
    id: "suggestion-approve",
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


        //* Get the suggestionId & database record for that suggestion.
        const suggestionId = interaction.message.embeds[0].footer.text;
        
        const Suggest = require('../../../structures/schemas/SuggestionSchema');
        const suggestion = await Suggest.findOne({
            guildId: interaction.guild.id,
            suggestId: suggestionId,
        }, (err, suggest) => {
            if (err) console.log(err);
        }).clone().catch((err => { }));

        //* Get the suggestion channel.
        const channel = await interaction.guild.channels.cache.get(`${suggestConfig.suggestChannelId}`);

        if (!channel) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Couldn't find a suggestion channel. Configure this on our [dashboard](https://dashboard.quabot.net).")
            ], ephemeral: true
        }).catch((err => { }));

        const msg = await channel.messages.fetch(`${suggestion.suggestMsgId}`).then(message => {
            console.log(message)
        });

        console.log(msg)
        // update message
        // update state
        // notify user in dm
        // update log message
        
    }
}