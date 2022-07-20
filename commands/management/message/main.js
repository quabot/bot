const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "message",
    description: "Send messages for tickets & suggestions.",
    permission: PermissionFlagsBits.Administrator,
    permissions: [PermissionFlagsBits.SendMessages],
    async execute(client, interaction, color) {

        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Send a message where users can create tickets or suggestions with the press of a button. Click one of the buttons below this message to get started.")
                    .setTimestamp()
            ], fetchReply: true, ephemeral: true,
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Suggestions")
                            .setCustomId("message-suggestions")
                            .setEmoji("💡")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setLabel("Tickets")
                            .setCustomId("message-tickets")
                            .setEmoji("🎫")
                            .setStyle(ButtonStyle.Secondary),
                    )
            ]
        }).catch((err => { }));

    }
}
