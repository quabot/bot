const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    id: "suggestion-delete",
    permission: PermissionFlagsBits.Administrator,
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
        
            
            //* Delete the suggestion & update log message.
            await message.delete().catch((err => { }));

            await interaction.message.edit({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New Suggestion")
                        .setColor(Colors.DarkRed)
                        .addFields(
                            { name: 'Suggestion', value: `${suggestion.suggestion}` },
                            { name: 'Suggested By', value: `${member}`, inline: true },
                            { name: 'State', value: `Deleted`, inline: true },
                            { name: 'Deleted By', value: `${interaction.user}`, inline: true },
                            { name: 'Message', value: `Deleted`, inline: true },
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
                                .setLabel("Delete")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Secondary),
                        )
                ]
            }).catch((err => { }));

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setDescription("Deleted that suggestion.")
                ], ephemeral: true
            }).catch((err => { }));

            //* Get the member to DM them.
            if (member) member.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle("Your suggestion was deleted!")
                        .setDescription(`Your suggestion in ${interaction.guild.name} was deleted.`)
                ]
            }).catch((err => { }));

            await Suggest.findOneAndDelete({
                guildId: interaction.guild.id,
                suggestId: suggestionId,
            }, (err, suggest) => {
                if (err) console.log(err);
            }).clone().catch((err => { }));

        });
    }
}
