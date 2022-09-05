const { PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputComponent, TextInputStyle, TextInputBuilder, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");
const { isValidHttpUrl } = require("../../../structures/functions/strings");

module.exports = {
    id: "embed-footer",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        const footerModal = new ModalBuilder()
            .setCustomId('embed-footer-modal')
            .setTitle("Embed Footer")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('text')
                            .setLabel("Footer Text")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                            .setMaxLength(2048)
                            .setPlaceholder("This is my footer!")
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('icon')
                            .setLabel("Footer Icon")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(false)
                            .setMaxLength(500)
                    )
            )

        await interaction.showModal(footerModal).catch((err => { }));

        const modal = await interaction.awaitModalSubmit({
            time: 180000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modal) {
            if (modal.customId !== 'embed-footer-modal') return;

            await modal.deferReply({ ephemeral: true }).catch((err => { }));
            const text = modal.fields.getTextInputValue("text");
            let url = modal.fields.getTextInputValue("icon") ? modal.fields.getTextInputValue("icon") : null;
            if (!text) return modal.editReply({ embeds: [await generateEmbed(color, "No text entered, try again.")], ephemeral: true }).catch((err => { }));
            if (isValidHttpUrl(url) === false) url = null;

            interaction.message.edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]),
                    EmbedBuilder.from(interaction.message.embeds[1]).setFooter({ text: text, iconURL: url }),
                ]
            }).catch((err => { }));

            modal.editReply({
                embeds: [await generateEmbed(color, `Set the footer!`)]
            }).catch((err => { }));
        }
    }
}