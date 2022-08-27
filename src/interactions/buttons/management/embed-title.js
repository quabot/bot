const { PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputComponent, TextInputStyle, TextInputBuilder, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");

module.exports = {
    id: "embed-title",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        const titleModal = new ModalBuilder()
            .setCustomId('embed-title-modal')
            .setTitle("Embed Title")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('title')
                            .setLabel("New title")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                            .setMaxLength(256)
                            .setPlaceholder("This is my embed title!")
                    )
            )

        await interaction.showModal(titleModal);

        const modal = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modal) {
            if (modal.customId !== 'embed-title-modal') return;

            await modal.deferReply({ ephemeral: true });
            const title = modal.fields.getTextInputValue("title");
            if (!title) modal.editReply({ embeds: [await generateEmbed(color, "No title entered, try again.")], ephemeral: true }).catch((e => { }));
            
            const description = interaction.message.embeds[1].data.description === '\u200b' ? null : interaction.message.embeds[1].data.description;
            
            interaction.message.edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]),
                    EmbedBuilder.from(interaction.message.embeds[1]).setTitle(title).setDescription(description),
                ]
            }).catch((e => { }));

            modal.editReply({
                embeds: [await generateEmbed(color, `Set the title to **${title}**`)]
            }).catch((e => { }));
        }
    }
}