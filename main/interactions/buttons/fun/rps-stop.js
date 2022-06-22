const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    id: "rpsClose",
    execute(interaction, client, color) {
        interaction.message.delete().catch(( err => { } ))
    }
}