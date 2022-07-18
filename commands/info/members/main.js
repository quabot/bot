const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "members",
    description: "Server members.",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .addFields(
                        { name: "Members", value: `${interaction.guild.memberCount}` }
                    )
                    .setTimestamp()
            ]
        }).catch((err => { }));

    }
}