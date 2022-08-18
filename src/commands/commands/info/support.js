const { Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "support",
    description: "Join the QuaBot support server.",
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("For questions, suggestions and more, join our support server at **[discord.gg/HYGA7Y6ptk](https://discord.gg/HYGA7Y6ptk)**.")
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}