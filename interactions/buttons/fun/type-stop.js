const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    id: "typeStop",
    execute(interaction, client, color) {
        interaction.message.edit({
            embeds: [
                new MessageEmbed()
                    .setDescription("Stopped the game. Removing this message in 5 seconds")
                    .setColor(color)
            ],
            components: []
        }).catch(err => console.log(err));

        setTimeout(() => {
            interaction.message.edit({
                embeds: [
                    new MessageEmbed()
                        .setDescription("Stopped the game. Removing this message in 4 seconds...")
                        .setColor(color)
                ],
            }).catch(err => console.log(err));
            setTimeout(() => {
                interaction.message.edit({
                    embeds: [
                        new MessageEmbed()
                            .setDescription("Stopped the game. Removing this message in 3 seconds...")
                            .setColor(color)
                    ],
                }).catch(err => console.log(err));
                setTimeout(() => {
                    interaction.message.edit({
                        embeds: [
                            new MessageEmbed()
                                .setDescription("Stopped the game. Removing this message in 2 seconds...")
                                .setColor(color)
                        ],
                    }).catch(err => console.log(err));
                    setTimeout(() => {
                        interaction.message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription("Stopped the game. Removing this message in 1 second...")
                                    .setColor(color)
                            ],
                        }).catch(err => console.log(err));
                        setTimeout(() => {
                            interaction.message.delete().catch(err => console.log(err));
                        }, 1000);

                    }, 1000);

                }, 1000);

            }, 1000);

        }, 1000);
    }
}