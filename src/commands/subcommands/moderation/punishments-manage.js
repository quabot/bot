const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "manage",
    command: "punishments",
    permission: PermissionFlagsBits.ModerateMembers,
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
