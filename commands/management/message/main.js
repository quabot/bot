const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');

module.exports = {
    name: "message",
    description: "Send messages for tickets & suggestions.",
    permission: "ADMINISTRATOR",
    permissions: ["SEND_MESSAGES"],
    async execute(client, interaction, color) {

        const msg = await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Send a message where users can create tickets or suggestions with the press of a button. Click one of the buttons below this message to get started.")
                    .setTimestamp()
            ], fetchReply: true, ephemeral: true,
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("Suggestions")
                            .setCustomId("message-suggestions")
                            .setEmoji("💡")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setLabel("Tickets")
                            .setCustomId("message-tickets")
                            .setEmoji("🎫")
                            .setStyle("SECONDARY"),
                    )
            ]
        }).catch((err => { }));

    }
}