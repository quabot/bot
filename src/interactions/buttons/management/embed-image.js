const { PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputComponent, TextInputStyle, TextInputBuilder, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");
const { isValidHttpUrl } = require("../../../structures/functions/strings");

module.exports = {
    id: "embed-image",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        const imageModal = new ModalBuilder()
            .setCustomId('embed-image-modal')
            .setTitle("Embed Image")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('image')
                            .setLabel("Embed image")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                            .setMaxLength(500)
                    )
            )

        await interaction.showModal(imageModal);

        const modal = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modal) {
            if (modal.customId !== 'embed-image-modal') return;

            await modal.deferReply({ ephemeral: true }).catch((e => { }));
            const image = modal.fields.getTextInputValue("image");
            if (!image) modal.editReply({ embeds: [await generateEmbed(color, "No image entered, try again.")], ephemeral: true }).catch((e => { }));
            if (isValidHttpUrl(image) === false) return modal.editReply({ embeds: [await generateEmbed(color, "No image entered, try again.")], ephemeral: true }).catch((e => { }));

            interaction.message.edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]),
                    EmbedBuilder.from(interaction.message.embeds[1]).setImage(image),
                ]
            }).catch((e => { }));

            modal.editReply({
                embeds: [await generateEmbed(color, `Set the image to **${image}**`)]
            }).catch((e => { }));
        }
    }
}