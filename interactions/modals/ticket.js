const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

// close ticket
module.exports = {
    id: "ticket",
    async execute(interaction, client, color) {

        console.log(interaction)
        const topic = interaction.fields.getTextInputValue('ticket-topic');
        
    }
}