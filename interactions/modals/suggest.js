const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { randomUUID } = require('node:crypto');

module.exports = {
    id: "suggestion",
    async execute(interaction, client, color) {

        const suggestion = interaction.fields.getTextInputValue('suggestion-box');

        //* Implement the suggestion config.
        const SuggestConfig = require('../../structures/schemas/SuggestionConfigSchema');
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

        //* Set the emoji sets.
        const emojiSet = suggestConfig.suggestEmojiSet;
        let emoji1 = "🔴";
        let emoji2 = "🟢";

        if (emojiSet === "checks") emoji1 = "❌";
        if (emojiSet === "checks") emoji2 = "✅";

        if (emojiSet === "arrows") emoji1 = "⬇️";
        if (emojiSet === "arrows") emoji2 = "⬆️";


        //* Send the message and reply to the user.
        const msg = await suggestChannel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle("New Suggestion!")
                    .setColor("BLUE")
                    .addField("Suggestion", `${suggestion}`)
                    .addField("Suggested By", `${interaction.user}`)
                    .setTimestamp()
                    .setFooter({ text: `Vote with the ${emoji2} and ${emoji1} below this message.`})
            ]
        }).catch((err => { }));

        await msg.react(emoji2);
        await msg.react(emoji1);

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Successfully left your suggestion. Check it out in ${suggestChannel}`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        //* Get the suggestion logging channel.
        const suggestLogChannel = await interaction.guild.channels.cache.get(`${suggestConfig.suggestLogChannelId}`);
        const uuid = randomUUID();

        //* Log the suggestion.
        if (suggestLogChannel) {

            suggestLogChannel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("New Suggestion")
                        .setColor("BLUE")
                        .addFields(
                            { name: 'Suggestion', value: `${suggestion}` },
                            { name: 'Suggested By', value: `${interaction.user}`, inline: true },
                            { name: 'State', value: `Pending`, inline: true },
                            { name: 'Message', value: `[Click to jump](${msg.url})`, inline: true },
                        )
                        .setFooter({ text: `${uuid}` })
                        .setTimestamp()
                ], components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('suggestion-approve')
                                .setLabel("Approve")
                                .setStyle("SUCCESS"),
                            new MessageButton()
                                .setCustomId('suggestion-reject')
                                .setLabel("Reject")
                                .setStyle("DANGER"),
                            new MessageButton()
                                .setCustomId('suggestion-delete')
                                .setLabel("Delete")
                                .setStyle("SECONDARY"),
                        )
                ]
            })
        }

        //* Create a record of the suggestion for the database.
        const Suggest = require('../../structures/schemas/SuggestionSchema');
        const newSuggest = new Suggest({
            guildId: interaction.guild.id,
            suggestId: uuid,
            suggestMsgId: msg.id,
            suggestion: suggestion,
            suggestionStatus: "PENDING",
            suggestionUserId: interaction.user.id,
        });

        newSuggest.save();

    }
}