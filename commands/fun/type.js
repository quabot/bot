const discord = require("discord.js");
const ms = require('ms');

const { TypeNoSentence } = require('../../files/embeds');
const colors = require('../../files/colors.json');
const sentences = [
    "minecraft is the best game",
    "this is a very easy sentence",
    "its the prime time of your life",
    "go spend your money on fortnite",
    "please make sure to like",
    "maybe even subscribe",
    "this is a very short sentence",
    "damn these sentences are very outdated...",
    "learn to type today",
    "this is a typing game",
    "this bot sucks",
    "guess who's back",
    "i have discord nitro",
    "imagine having discord nitro",
    "the new discord logo sucks",
    "do you want free nitro? {NO}"
]
const sentence = sentences[Math.floor(Math.random() * sentences.length)];

module.exports = {
    name: "type",
    description: "Play a game that makes you type words/sentences in 15 seconds.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        const author = interaction.user;
        if (!sentence) return interaction.reply({ embeds: [TypeNoSentence] });

        const embed = new discord.MessageEmbed()
            .setTitle("Type this sentence")
            .setDescription(`Type this sentence in the next 20 seconds:\n\`${sentence}\``)
            .setColor(colors.COLOR);
        interaction.reply({ embeds: [embed] });

        const correctSentence = new discord.MessageEmbed()
            .setTitle(":white_check_mark: Correct sentence!")
            .setDescription("You typed the correcct sentence!")
            .addField("Sentence:", sentence)
            .setColor(colors.LIME)

        setTimeout(() => {
            const filter = m => interaction.user === author;
            const collector = interaction.channel.createMessageCollector({ time: 15000 });
            collector.on('collect', m => {
                if (m.content.toLowerCase() === sentence) {
                    m.reply({ embeds: [correctSentence] });
                    return;
                } else {
                    if (m.author.bot) return;
                    const wrongSentence = new discord.MessageEmbed()
                        .setTitle("❌ Wrong sentence!")
                        .setDescription("You typed the incorrect sentence!")
                        .addField("Sentence:", `${sentence}`)
                        .addField("Your answer:", `**${m.content}**`)
                        .setColor(colors.RED)
                    m.reply({ embeds: [wrongSentence] });
                    collector.stop()
                    return
                }
            });
        }, 500);
    }
}
