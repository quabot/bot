const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "dashboard",
    description: "Link to our dashboard.",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Here you go!")
            ], ephemeral: true, components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://dashboard.quabot.net")
                            .setLabel("Link to our dashboard")
                    )
            ]
        }).catch(( err => { } ));

    }
}