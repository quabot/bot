const { PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputComponent, TextInputStyle, TextInputBuilder, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");
const { isValidHttpUrl } = require("../../../structures/functions/strings");

module.exports = {
    id: "embed-url",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        const urlModal = new ModalBuilder()
            .setCustomId('embed-url-modal')
            .setTitle("Embed Url")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('url')
                            .setLabel("New url")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                            .setMaxLength(500)
                            .setPlaceholder("https://quabot.net")
                    )
            )

        await interaction.showModal(urlModal).catch((err => { }));

        const modal = await interaction.awaitModalSubmit({
            time: 180000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modal) {
            if (modal.customId !== 'embed-url-modal') return;

            await modal.deferReply({ ephemeral: true }).catch((err => { }));
            const url = modal.fields.getTextInputValue("url");
            if (!url) return modal.editReply({ embeds: [await generateEmbed(color, "No url entered, try again.")], ephemeral: true }).catch((err => { }));
            if (isValidHttpUrl(url) === false) return modal.editReply({ embeds: [await generateEmbed(color, "No url entered, try again.")], ephemeral: true }).catch((err => { }));

            interaction.message.edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]),
                    EmbedBuilder.from(interaction.message.embeds[1]).setURL(url),
                ]
            }).catch((err => { }));

            modal.editReply({
                embeds: [await generateEmbed(color, `Set the url to **${url}**`)]
            }).catch((err => { }));
        }
    }
}