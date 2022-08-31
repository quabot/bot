const { Client, Interaction, Colors, ButtonStyle } = require('discord.js');
const Suggest = require('../../structures/schemas/SuggestConfigSchema');
const Suggestion = require('../../structures/schemas/SuggestSchema');
const { generateEmbed } = require('../../structures/functions/embed');
const { randomUUID } = require('node:crypto');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');

module.exports = {
    id: "create-suggestion",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: true }).catch((e => { }));

        const suggestion = interaction.fields.getTextInputValue("suggestion");

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



        if (!suggestConfig) return interaction.editReply({
            embeds: [await generateEmbed(color, "A config is being generated, please run the command again.")],
            ephemeral: true
        }).catch((e => { }));

        if (suggestConfig.suggestEnabled === false) return interaction.editReply({
            embeds: [await generateEmbed(color, "Suggestions are not enabled in this server.")],
            ephemeral: true
        }).catch((e => { }));



        const channel = interaction.guild.channels.cache.get(`${suggestConfig.suggestChannelId}`);
        if (!channel) return interaction.editReply({
            embeds: [await generateEmbed(color, "Couldn't find the suggestions channel. Ask an admin to configure this on our [dashboard](https://dashboard.quabot.net).")],
            ephemeral: true
        }).catch((e => { }));



        const emojiSet = suggestConfig.suggestEmojiSet;
        let emoji1 = "🔴";
        let emoji2 = "🟢";

        if (emojiSet === "checks") emoji1 = "❌";
        if (emojiSet === "checks") emoji2 = "✅";

        if (emojiSet === "arrows") emoji1 = "⬇️";
        if (emojiSet === "arrows") emoji2 = "⬆️";



        const msg = await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("New Suggestion!")
                    .setColor(Colors.Blue)
                    .addFields(
                        { name: "Suggestion", value: `${suggestion}` },
                        { name: "Suggested By", value: `${interaction.user}` }
                    )
                    .setTimestamp()
                    .setFooter({ text: `Vote with the ${emoji2} and ${emoji1} below this message.` })
            ]
        }).catch((e => { }));

        if (!msg) return interaction.editReply({
            embeds: [await generateEmbed(color, `Failed to send the message! I cannot talk in ${channel}.`)],
            ephemeral: true
        }).catch((e => { }));



        await msg.react(emoji2);
        await msg.react(emoji1);



        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Successfully left your suggestion. Check it out in ${channel}. [Jump](${msg.url})`)
                    .setColor(Colors.Green)
            ], ephemeral: true
        }).catch((e => { }));


        const uuid = randomUUID();
        const uuidCheck = await Suggestion.findOne({
            guildId: interaction.guildId,
            suggestId: uuid
        }, (err, suggest) => {
            if (err) console.error(err);
        }).clone().catch(function (err) { });

        if (uuidCheck) return interaction.editReply({
            embeds: [await generateEmbed(color, "🚫 There was an error! Try again!")],
            ephemeral: true
        }).catch((e => { }));
        

        const newSuggest = new Suggestion({
            guildId: interaction.guild.id,
            suggestId: uuid,
            suggestMsgId: msg.id,
            suggestion: suggestion,
            suggestionStatus: "PENDING",
            suggestionUserId: interaction.user.id,
        });
        newSuggest.save()
            .catch(err => {
                console.log(err);
            });


        const suggestLogChannel = interaction.guild.channels.cache.get(`${suggestConfig.suggestLogChannelId}`);
        if (suggestConfig.suggestLogEnabled) {

            suggestLogChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New Suggestion")
                        .setColor(Colors.Blue)
                        .addFields(
                            { name: 'Suggestion', value: `${suggestion}` },
                            { name: 'Suggested By', value: `${interaction.user}`, inline: true },
                            { name: 'State', value: `Pending`, inline: true },
                            { name: 'Message', value: `[Click to jump](${msg.url})`, inline: true },
                        )
                        .setFooter({ text: `${uuid}` })
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
                                .setLabel("Deny")
                                .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                                .setCustomId('suggestion-delete')
                                .setLabel("Delete")
                                .setStyle(ButtonStyle.Secondary),
                        )
                ]
            }).catch((e => { }));

        }
    }
}