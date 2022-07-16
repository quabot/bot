const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');

module.exports = {
    name: "manage",
    command: "moderate",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("To delete and view punishments, use our [dashboard](https://dashboard.quabot.net).")
            ], ephemeral: true
        }).catch((err => { }));


    }
}
