const { ButtonBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");

module.exports = {
    id: "embed-cancel",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((e => { }));

        const buttons1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("embed-color")
                    .setLabel("Set Color")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-title")
                    .setLabel("Set Title")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-url")
                    .setLabel("Set Url")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-author")
                    .setLabel("Set Author")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-description")
                    .setLabel("Set Description")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
            )

        const buttons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("embed-thumbnail")
                    .setLabel("Set Thumbnail")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-image")
                    .setLabel("Set Image")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-footer")
                    .setLabel("Set Footer")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-addfield")
                    .setLabel("Add Field")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-removefield")
                    .setDisabled(true)
                    .setLabel("Remove Field")
                    .setStyle(ButtonStyle.Danger),
            )

        const buttons3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("embed-send")
                    .setLabel("Send Message")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("embed-cancel")
                    .setDisabled(true)
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Danger),
            )

        interaction.message.edit({ components: [buttons1, buttons2, buttons3] }).catch((e => { }));

        interaction.editReply({
            embeds: [await generateEmbed(color, "Cancelled!")]
        }).catch((e => { }));
    }
}