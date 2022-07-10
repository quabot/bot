const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "dashboard",
    description: "Link to our dashboard.",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Check our dashboard at [dashboard.quabot.net](https://dashboard.quabot.net) and use it to configure settings.")
            ], ephemeraL: true
        }).catch(( err => { } ));

    }
}