const { Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "dashboard",
    description: "Get a link to the QuaBot dashboard.",
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Configure QuaBot on our dashboard **[here](https://dashboard.quabot.net)**.")
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}