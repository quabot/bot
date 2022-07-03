const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "filters",
    command: "music",
    async execute(client, interaction, color) {

        // one channel mode, music enabled and dj role

        const filter = interaction.options.getString("option");

        const setFilter = client.distube.setFilter(interaction, filter);

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Current filter(s):\n`" + (setFilter.join("\n") || "Off") + "`")
            ]
        }).catch(( err => { } ));

    }
}