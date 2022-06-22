const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "message",
    description: "Send an admin message.",
    permission: "ADMINISTRATOR",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Click on the buttons below this message to send any of those messages. The messages will have buttons below them that users can use to create tickets/suggestions.`)
                    .setColor(color)
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('suggestion-create-message')
                            .setLabel('💡 Suggestions')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('ticket-create-message')
                            .setLabel('📝 Tickets')
                            .setStyle('SECONDARY'),
                    )
            ], ephemeral: true
        }).catch((err => { }));

    }
}