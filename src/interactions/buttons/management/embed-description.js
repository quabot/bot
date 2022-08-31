const { PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputComponent, TextInputStyle, TextInputBuilder, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");

module.exports = {
    id: "embed-description",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        const descriptionModal = new ModalBuilder()
            .setCustomId('embed-description-modal')
            .setTitle("Embed Description")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('description')
                            .setLabel("New description")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                            .setMaxLength(4000)
                            .setPlaceholder("This is my embed description!")
                    )
            )

        await interaction.showModal(descriptionModal);

        const modal = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modal) {
            if (modal.customId !== 'embed-description-modal') return;

            await modal.deferReply({ ephemeral: true }).catch((e => { }));
            const description = modal.fields.getTextInputValue("description");
            if (!description) modal.editReply({ embeds: [await generateEmbed(color, "No description entered, try again.")], ephemeral: true }).catch((e => { }));
            
            interaction.message.edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]),
                    EmbedBuilder.from(interaction.message.embeds[1]).setDescription(description),
                ]
            }).catch((e => { }));

            modal.editReply({
                embeds: [await generateEmbed(color, `Set the description to **${description}**`)]
            }).catch((e => { }));
        }
    }
}