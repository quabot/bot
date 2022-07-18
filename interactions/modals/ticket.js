const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

// close ticket
module.exports = {
    id: "ticket",
    async execute(interaction, client, color) {

        const topic = interaction.fields.getTextInputValue('ticket-topic');
        
    }
}