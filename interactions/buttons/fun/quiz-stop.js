const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    id: "quiz-stop",
    async execute(interaction, client, color) {

        interaction.update({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Interaction ended. Deleting message...")
            ], components: []
        }).catch(( err => { } ));

        setTimeout(() => {
            interaction.message.delete().catch(( err => { } ));
        }, 2000);
    }
}