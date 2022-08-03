const { EmbedBuilder } = require('discord.js');
const wyr = require('../../../structures/files/wyr.json');

module.exports = {
    name: "wyr",
    description: "Play a game of \"Would You Rather\".",
    async execute(client, interaction, color) {

        const wyrPicked = wyr[Math.floor(Math.random() * wyr.length)];

        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`**Would you rather...**\n1️⃣ - ${wyrPicked.option1}\n2️⃣ - ${wyrPicked.option2}`)
                    .setFooter({ text: "Time limit: 1 minute" })
            ], fetchReply: true
        }).catch((err => { }));

        msg.react("1️⃣");
        msg.react("2️⃣");

        const filter = (reaction, user) => {
            return user.id === interaction.user.id;
        };

        const collector = msg.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name === "1️⃣") {
                reaction.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setDescription(`You chose...\n\n1️⃣ ${wyrPicked.option1}`)
                    ],
                }).catch((err => { }));
                collector.stop();
            } else if (reaction.emoji.name === "2️⃣") {
                reaction.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setDescription(`You chose...\n\n2️⃣ ${wyrPicked.option2}`)
                    ],
                }).catch((err => { }));
                collector.stop();
            }
        });

    }
}