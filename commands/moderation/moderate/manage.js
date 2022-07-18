const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message } = require('discord.js');

module.exports = {
    name: "manage",
    command: "moderate",
    permission: "MODERATE_MEMBERS",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("To delete and view punishments, use our [dashboard](https://dashboard.quabot.net).")
            ], ephemeral: true
        }).catch((err => { }));


    }
}
