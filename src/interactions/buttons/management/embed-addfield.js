const { ButtonStyle, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputComponent, TextInputStyle, TextInputBuilder, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");
const { isValidHttpUrl } = require("../../../structures/functions/strings");

module.exports = {
    id: "embed-addfield",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        const fieldModal = new ModalBuilder()
            .setCustomId('embed-addfield-modal')
            .setTitle("Embed Add Field")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('title')
                            .setLabel("Field Title")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                            .setMaxLength(256)
                            .setPlaceholder("Field Title")
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('value')
                            .setLabel("Field Value")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                            .setMaxLength(1024)
                            .setPlaceholder("Field Value")
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('inline')
                            .setLabel("Field Inline")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                            .setMaxLength(5)
                            .setPlaceholder("true/false")
                    )
            )

        await interaction.showModal(fieldModal);

        const modal = await interaction.awaitModalSubmit({
            time: 180000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modal) {
            if (modal.customId !== 'embed-addfield-modal') return;

            await modal.deferReply({ ephemeral: true }).catch((e => { }));
            const title = modal.fields.getTextInputValue("title");
            const value = modal.fields.getTextInputValue("value");
            const inline = modal.fields.getTextInputValue("inline") ? true : false;

            if (!title) return modal.editReply({ embeds: [await generateEmbed(color, "No title entered, try again.")], ephemeral: true }).catch((e => { }));
            if (!value) return modal.editReply({ embeds: [await generateEmbed(color, "No value entered, try again.")], ephemeral: true }).catch((e => { }));

            interaction.message.edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]),
                    EmbedBuilder.from(interaction.message.embeds[1]).addFields({ name: title, value: value, inline: inline }),
                ]
            }).catch((e => { }));

            modal.editReply({
                embeds: [await generateEmbed(color, `Added a field!`)]
            }).catch((e => { }));
        }
    }
}