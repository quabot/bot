const { ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    id: "quiz-end",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {
        
        interaction.update({
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel("Play Again")
                        .setDisabled(true)
                        .setCustomId("quiz-replay"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel("End Interaction")
                        .setDisabled(true)
                        .setCustomId("quiz-end")
                )
            ]
        }).catch((e => { }));
        
    }
}