const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "support",
    description: "Link to our support server.",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("Join our [support server here](https://discord.gg/HhPtvhPU2n). And [invite the bot here](https://invite.quabot.net).")
                    .setColor(color)
            ], ephemeral: true
        }).catch(( err => { } ));

    }
}