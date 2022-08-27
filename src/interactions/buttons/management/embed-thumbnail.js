const { ButtonStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputComponent, TextInputStyle, TextInputBuilder, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");
const { isValidHttpUrl } = require("../../../structures/functions/strings");

module.exports = {
    id: "embed-thumbnail",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const thumbnailModal = new ModalBuilder()
            .setCustomId('embed-thumbnail-modal')
            .setTitle("Embed Thumbnail")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('thumbnail')
                            .setLabel("Embed thumbnail")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                            .setMaxLength(500)
                    )
            )

        await interaction.showModal(thumbnailModal);

        const modal = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modal) {
            if (modal.customId !== 'embed-thumbnail-modal') return;

            await modal.deferReply({ ephemeral: true });
            const thumbnail = modal.fields.getTextInputValue("thumbnail");
            if (!thumbnail) modal.editReply({ embeds: [await generateEmbed(color, "No thumbnail entered, try again.")], ephemeral: true }).catch((e => { }));
            if (isValidHttpUrl(thumbnail) === false) return modal.editReply({ embeds: [await generateEmbed(color, "No thumbnail entered, try again.")], ephemeral: true }).catch((e => { }));

            interaction.message.edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]),
                    EmbedBuilder.from(interaction.message.embeds[1]).setThumbnail(thumbnail),
                ]
            }).catch((e => { }));

            modal.editReply({
                embeds: [await generateEmbed(color, `Set the thumbnail to **${thumbnail}**`)]
            }).catch((e => { }));
        }
    }
}