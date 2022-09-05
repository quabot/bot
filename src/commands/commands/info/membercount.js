const { Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "membercount",
    description: "Get the amount of people in the server.",
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((e => { }));

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`${interaction.guild.name} Members`)
                    .setDescription(`${interaction.guild.memberCount}`)
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}