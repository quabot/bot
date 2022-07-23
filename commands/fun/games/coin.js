const { EmbedBuilder, Interaction } = require('discord.js');

module.exports = {
    name: "coin",
    command: "games",
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        const options = ['Heads', 'Tails'];
        const flip = options[Math.floor(Math.random() * options.length)];

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🪙 ${flip}!`)
                    .setColor(color)
            ]
        }).catch((err => { }));

    }
}