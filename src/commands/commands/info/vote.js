const { Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "vote",
    description: "Vote for QuaBot",
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("By voting for QuaBot, you can help us grow for free! It only takes a few seconds, and it gives you some perks! Vote **[here]()**.")
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}