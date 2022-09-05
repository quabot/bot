const { ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, ButtonBuilder, ActionRowBuilder, Colors, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");
const Suggest = require('../../../structures/schemas/SuggestConfigSchema');
const Suggestion = require('../../../structures/schemas/SuggestSchema');

module.exports = {
    id: "suggestion-reject",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
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
        }).catch((e => { }));

        if (suggestConfig.suggestEnabled === false) return interaction.reply({
            embeds: [await generateEmbed(color, "Suggestions are not enabled in this server.")],
            ephemeral: true
        }).catch((e => { }));



        const channel = interaction.guild.channels.cache.get(`${suggestConfig.suggestChannelId}`);
        if (!channel) return interaction.reply({
            embeds: [await generateEmbed(color, "Couldn't find the suggestions channel. Ask an admin to configure this on our [dashboard](https://dashboard.quabot.net).")],
            ephemeral: true
        }).catch((e => { }));


        const suggestionId = interaction.message.embeds[0].footer.text;

        const suggestion = await Suggestion.findOne({
            guildId: interaction.guild.id,
            suggestId: suggestionId,
        }, (err, suggest) => {
            if (err) console.log(err);
        }).clone().catch((e => { }));


        const msg = await channel.messages.fetch(`${suggestion.suggestMsgId}`).then(async message => {

            if (!message) return interaction.reply({
                embeds: [await generateEmbed(color, "Couldn't find that message. Are you sure it wasn't deleted?")],
                ephemeral: true
            }).catch((e => { }));


            const Modal = new ModalBuilder()
                .setCustomId('suggestion-deny-modal')
                .setTitle("Reason for deny")
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('reason')
                                .setLabel("Deny Reason")
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                                .setMaxLength(250)
                        )
                )

            await interaction.showModal(Modal);

            const modal = await interaction.awaitModalSubmit({
                time: 60000,
                filter: i => i.user.id === interaction.user.id,
            }).catch(e => {
                return null
            });

            if (modal) {
                await modal.deferReply({ ephemeral: true }).catch((e => { }));

                const reason = modal.fields.getTextInputValue("reason");
                if (!reason) return;

                const member = interaction.guild.members.cache.get(`${suggestion.suggestionUserId}`);
                const embed = EmbedBuilder.from(message.embeds[0]).setColor(Colors.Red).addFields({ name: "Denied By", value: `${interaction.user}` }, { name: "Response", value: reason });
                await message.edit({
                    embeds: [embed]
                }).catch((e => { }));

                interaction.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("New Suggestion")
                            .setColor(Colors.Red)
                            .addFields(
                                { name: 'Suggestion', value: `${suggestion.suggestion}` },
                                { name: 'Suggested By', value: `${member}`, inline: true },
                                { name: 'State', value: `Denied`, inline: true },
                                { name: 'Denied By', value: `${interaction.user}`, inline: true },
                                { name: 'Deny Reason', value: `${reason}`, inline: true },
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

                modal.editReply({
                    embeds: [await generateEmbed(color, "Denied the suggestion.")], ephemeral: true
                }).catch((e => { }));

                if (member) member.send({
                    embeds: [await generateEmbed(color, `Your suggestion in ${interaction.guild.name} was denied. Go check it out [here](${message.url})!`).setTitle("Your suggestion was denied.")]
                }).catch((e => { }));

                await Suggestion.findOneAndDelete({ suggestId: suggestionId }).catch((e => { }));

            }
        }).catch((async () => {
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Couldn't find that message. Are you sure it wasn't deleted?")],
                ephemeral: true
            }).catch((e => { }));
        }))
    }
}