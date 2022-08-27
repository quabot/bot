const { ButtonStyle, ButtonBuilder, ActionRowBuilder, Colors, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");
const Suggest = require('../../../structures/schemas/SuggestConfigSchema');
const Suggestion = require('../../../structures/schemas/SuggestSchema');

module.exports = {
    id: "suggestion-delete",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: true });

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


        const suggestionId = interaction.message.embeds[0].footer.text;

        const suggestion = await Suggestion.findOne({
            guildId: interaction.guild.id,
            suggestId: suggestionId,
        }, (err, suggest) => {
            if (err) console.log(err);
        }).clone().catch((err => { }));


        const msg = await channel.messages.fetch(`${suggestion.suggestMsgId}`).then(async message => {

            if (!message) return interaction.editReply({
                embeds: [await generateEmbed(color, "Couldn't find that message. Are you sure it wasn't deleted?")],
                ephemeral: true
            }).catch((e => { }));


            const member = interaction.guild.members.cache.get(`${suggestion.suggestionUserId}`);

            await message.delete().catch((e => { }));

            interaction.editReply({
                embeds: [await generateEmbed(color, "Deleted the suggestion.")], ephemeral: true
            }).catch((err => { }));

            if (member) member.send({
                embeds: [await generateEmbed(color, `Your suggestion in ${interaction.guild.name} was deleted.`).setTitle("Your suggestion was deleted.")]
            }).catch((err => { }));

            interaction.message.edit({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New Suggestion")
                        .setColor(Colors.DarkRed)
                        .addFields(
                            { name: 'Suggestion', value: `${suggestion.suggestion}` },
                            { name: 'Suggested By', value: `${member}`, inline: true },
                            { name: 'State', value: `Deleted`, inline: true },
                            { name: 'Deleted By', value: `${interaction.user}`, inline: true },
                        )
                        .setFooter({ text: `${suggestion.suggestId}` })
                        .setTimestamp()
                ], components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('suggestion-approve')
                                .setLabel("Approve")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('suggestion-reject')
                                .setLabel("Reject")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                                .setCustomId('suggestion-delete')
                                .setDisabled(true)
                                .setLabel("Delete")
                                .setStyle(ButtonStyle.Secondary),
                        )
                ]
            }).catch((e => { }));

            await Suggestion.findOneAndDelete({ suggestId: suggestionId }).catch((e => { }));
        });
    }
}