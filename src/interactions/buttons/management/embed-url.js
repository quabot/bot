const { ButtonStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputComponent, TextInputStyle, TextInputBuilder, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");

module.exports = {
    id: "embed-url",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
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
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                            .setMaxLength(256)
                            .setPlaceholder("https://quabot.net")
                    )
            )

        await interaction.showModal(urlModal);

        const modal = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modal) {
            if (modal.customId !== 'embed-url-modal') return;

            await modal.deferReply({ ephemeral: true });
            const url = modal.fields.getTextInputValue("url");
            if (!url) modal.editReply({ embeds: [await generateEmbed(color, "No url entered, try again.")], ephemeral: true }).catch((e => { }));
                        
            interaction.message.edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]),
                    EmbedBuilder.from(interaction.message.embeds[1]).setURL(url),
                ]
            }).catch((e => { }));

            modal.editReply({
                embeds: [await generateEmbed(color, `Set the url to **${url}**`)]
            }).catch((e => { }));
        }
    }
}