const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle } = require('discord.js');

module.exports = {
    id: "suggestion-reject",
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

        //* Set the emoji sets.
        const emojiSet = suggestConfig.suggestEmojiSet;
        let emoji1 = "🔴";
        let emoji2 = "🟢";

        if (emojiSet === "checks") emoji1 = "❌";
        if (emojiSet === "checks") emoji2 = "✅";

        if (emojiSet === "arrows") emoji1 = "⬇️";
        if (emojiSet === "arrows") emoji2 = "⬆️";


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
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Couldn't find a suggestion channel. Configure this on our [dashboard](https://dashboard.quabot.net).")
            ], ephemeral: true
        }).catch((err => { }));

        const msg = await channel.messages.fetch(`${suggestion.suggestMsgId}`).then(async message => {

            if (!message) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Couldn't find the message beloning to that suggestion! Are you sure it wasn't deleted?`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));

            const member = interaction.guild.members.cache.get(`${suggestion.suggestionUserId}`);


            //* Update the suggestion & log message.
            await message.edit({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New Suggestion!")
                        .setColor(Colors.Red)
                        .setDescription("This suggestion was rejected.")
                        .addFields(
                            { name: "Suggestion", value: `${suggestion.suggestion}` },
                            { name: "Suggested By", value: `${member}` },
                        )
                        .setTimestamp()
                        .setFooter({ text: `Vote with the ${emoji2} and ${emoji1} below this message.` })
                ]
            }).catch((err => { }));

            await interaction.message.edit({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New Suggestion")
                        .setColor(Colors.Red)
                        .addFields(
                            { name: 'Suggestion', value: `${suggestion.suggestion}` },
                            { name: 'Suggested By', value: `${member}`, inline: true },
                            { name: 'State', value: `Rejected`, inline: true },
                            { name: 'Recjected By', value: `${interaction.user}`, inline: true },
                            { name: 'Message', value: `[Click to jump](${message.url})`, inline: true },
                        )
                        .setFooter({ text: `${suggestion.suggestId}` })
                        .setTimestamp()
                ], components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('suggestion-approve')
                                .setLabel("Approve")
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('suggestion-reject')
                                .setLabel("Reject")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                                .setCustomId('suggestion-delete')
                                .setLabel("Delete")
                                .setStyle(ButtonStyle.Secondary),
                        )
                ]
            }).catch((err => { }));

            //* Get the member to DM them.
            if (member) member.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle("Your suggestion was rejected!")
                        .setDescription(`Your suggestion in ${interaction.guild.name} was rejected. Go check it out [here](${message.url})!`)
                ]
            }).catch((err => { }));

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setDescription("Rejected that suggestion.")
                ], ephemeral: true
            }).catch((err => { }));

            await suggestion.updateOne({
                suggestionStatus: "REJECTED"
            });

        });
    }
}