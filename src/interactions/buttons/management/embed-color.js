const { PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputComponent, TextInputStyle, TextInputBuilder, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");

module.exports = {
    id: "embed-color",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        const colorModal = new ModalBuilder()
            .setCustomId('embed-color-modal')
            .setTitle("Embed Color")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('color')
                            .setLabel("New color")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                            .setMaxLength(6)
                            .setPlaceholder("#fff")
                    )
            )

        await interaction.showModal(colorModal);

        const modal = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modal) {
            if (modal.customId !== 'embed-color-modal') return;
            await modal.deferReply({ ephemeral: true }).catch((e => { }));
            const enteredColor = modal.fields.getTextInputValue("color");
            if (!enteredColor) modal.editReply({ embeds: [await generateEmbed(color, "No color entered, try again.")], ephemeral: true }).catch((e => { }));
            if (!/^#([0-9A-F]{6}){1,2}$/i.test(enteredColor)) modal.editReply({ embeds: [await generateEmbed(color, "Please enter a valid hex color code.")], ephemeral: true }).catch((e => { }));
            
            interaction.message.edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]),
                    EmbedBuilder.from(interaction.message.embeds[1]).setColor(enteredColor),
                ]
            }).catch((e => { }));

            modal.editReply({
                embeds: [await generateEmbed(color, `Set the color to **${enteredColor}**`)]
            }).catch((e => { }));
        }
    }
}