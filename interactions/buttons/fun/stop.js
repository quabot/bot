const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    id: "stop",
    async execute(interaction, client, color) {

        interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Interaction ended. Deleting message...")
            ], components: []
        }).catch(( err => { } ));

        setTimeout(() => {
            interaction.message.delete().catch(( err => { } ));
        }, 2000);
    }
}