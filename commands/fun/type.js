const discord = require("discord.js");
const ms = require('ms');

const { TypeNoSentence } = require('../../files/embeds');
const colors = require('../../files/colors.json');
const sentence = sentences[Math.floor(Math.random() * sentences.length)];
const sentences = [
    "MCLands is the best minecraft server", 
    "discord.mclands.net for best mc server", 
    "minecraft is the best game", 
    "this is a very easy sentence", 
    "its the prime time of your life", 
    "go spend your money on fortnite", 
    "please make sure to like", 
    "maybe even subscribe", 
    "this is a very short sentence", 
    "learn to type today", 
    "this is a typing game", 
    "this bot sucks",
    "guess who's back", 
    "i have discord nitro", 
    "imagine having discord nitro", 
    "the new discord logo sucks", 
    "do you want free nitro? {NO}"
]

module.exports = {
    name: "type",
    aliases: ['type-game', 'typing', 'tgame', 'bigpp'],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const author = message.author.id
        if (!sentence) return message.channel.send({embeds: [TypeNoSentence]});

        const embed = new discord.MessageEmbed()
            .setTitle("Type this sentence")
            .setDescription(`Type this sentence in the next 20 seconds:\n\`${sentence}\``)
            .setColor(colors.COLOR);
        message.channel.send({ embeds: [embed] });

        const correctSentence = new discord.MessageEmbed()
            .setTitle(":white_check_mark: Correct sentence!")
            .setDescription("You typed the correcct sentence!")
            .addField("Sentence:", sentence)
            .setColor(colors.LIME)

        const filter = m => m.author.id === author;
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 });
        collector.on('collect', m => {
            if (m.content.toLowerCase() === sentence) {
                message.channel.send({ embeds: [correctSentence] });
                return;
            } else {
                const wrongSentence = new discord.MessageEmbed()
                    .setTitle("❌ Wrong sentence!")
                    .setDescription("You typed the incorrect sentence!")
                    .addField("Sentence:", `${sentence}`)
                    .addField("Your answer:", `**${m.content}**`)
                    .setColor(colors.RED)
                message.channel.send({embeds: [wrongSentence] });
            }
        });

    }
}
