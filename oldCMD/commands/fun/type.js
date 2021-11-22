const discord = require("discord.js");
const ms = require('ms');

const { TypeNoSentence, errorMain } = require('../../files/embeds');
const colors = require('../../files/colors.json');
const { Sentences } = require('../../validation/sentences');

module.exports = {
    name: "type",
    description: "Play a game that makes you type words/sentences in 15 seconds.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const sentenceSum = Math.floor(Math.random() * Sentences.length);
            const sentence = Sentences[sentenceSum];

            const author = interaction.user;
            if (!sentence) return interaction.reply({ embeds: [TypeNoSentence] });

            const embed = new discord.MessageEmbed()
                .setTitle("Type this sentence")
                .setDescription(`Type this sentence in the next 20 seconds:\n\`${sentence}\``)
                .setColor(colors.COLOR);
            interaction.reply({ embeds: [embed] });

            setTimeout(() => {
                var callTime = (new Date()).getTime();
                console.log(callTime)
                const filter = m => interaction.user === author;
                const collector = interaction.channel.createMessageCollector({ time: 15000 });
                collector.on('collect', m => {
                    if (m.content === sentence) {
                        var timeSpent = new Date().getTime() - callTime
                        var date = new Date(timeSpent);
                        var timeSpentConverted = date.getSeconds();
                        const correctSentence = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Correct sentence!")
                            .setDescription("You typed the correcct sentence!")
                            .addField("Sentence:", `${sentence}`)
                            .addField("Time spent", `\`${timeSpentConverted} seconds\``)
                            .setColor(colors.LIME)
                        m.reply({ embeds: [correctSentence] });
                        return;
                    } else {
                        if (m.author.bot) return;
                        var timeSpent = new Date().getTime() - callTime
                        var date = new Date(timeSpent);
                        var timeSpentConverted = date.getSeconds();
                        const wrongSentence = new discord.MessageEmbed()
                            .setTitle("❌ Wrong sentence!")
                            .setDescription("You typed the incorrect sentence!")
                            .addField("Sentence:", `${sentence}`)
                            .addField("Your answer:", `**${m.content}**`)
                            .addField("Time spent", `\`${timeSpentConverted} seconds\``)
                            .setColor(colors.RED)
                        m.reply({ embeds: [wrongSentence] });
                        collector.stop()
                        return
                    }
                });
            }, 500);
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }


    }
}
