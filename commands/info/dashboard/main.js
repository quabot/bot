const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "dashboard",
    description: "Link to our dashboard.",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Here you go!")
            ], ephemeral: true, components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle("LINK")
                            .setURL("https://dashboard.quabot.net")
                            .setLabel("Link to our dashboard")
                    )
            ]
        }).catch(( err => { } ));

    }
}