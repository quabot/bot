const { ButtonStyle, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputComponent, TextInputStyle, TextInputBuilder, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");
const { isValidHttpUrl } = require("../../../structures/functions/strings");

module.exports = {
    id: "embed-author",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        const authorModal = new ModalBuilder()
            .setCustomId('embed-url-modal')
            .setTitle("Embed Author")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('text')
                            .setLabel("Author Name")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                            .setMaxLength(256)
                            .setPlaceholder("Bill Gates"),
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('url')
                            .setLabel("Author Url")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                            .setMaxLength(250)
                            .setPlaceholder("https://quabot.net"),
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('icon')
                            .setLabel("Icon Url")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                            .setMaxLength(250)
                            .setPlaceholder("https://i.imgur.com/Q9c5mvz.png"),
                    )
            )

        await interaction.showModal(authorModal).catch((e => { }));

        const modal = await interaction.awaitModalSubmit({
            time: 180000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modal) {
            if (modal.customId !== 'embed-url-modal') return;

            await modal.deferReply({ ephemeral: true }).catch((e => { }));
            const text = modal.fields.getTextInputValue("text");
            let url = modal.fields.getTextInputValue("url") ? modal.fields.getTextInputValue("url") : null;
            let icon = modal.fields.getTextInputValue("icon") ? modal.fields.getTextInputValue("icon") : null;
            if (!text) modal.editReply({ embeds: [await generateEmbed(color, "No text entered, try again.")], ephemeral: true }).catch((e => { }));
            if (isValidHttpUrl(url) === false) url = null;
            if (isValidHttpUrl(icon) === false) icon = null;
            
            const description = interaction.message.embeds[1].data.description === '\u200b' ? null : interaction.message.embeds[1].data.description;
            
            interaction.message.edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]),
                    EmbedBuilder.from(interaction.message.embeds[1]).setDescription(description).setAuthor({ name: text, iconURL: icon, url }),
                ]
            }).catch((e => { }));

            modal.editReply({
                embeds: [await generateEmbed(color, `Successfully set the author!`)]
            }).catch((e => { }));
        }
    }
}