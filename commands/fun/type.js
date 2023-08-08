const discord = require("discord.js");
const sentences = ["minecraft is the best game", "this is a very easy sentence", "its the prime time of your life", "go spend your money on fortnite", "please make sure to like", "maybe even subscribe", "this is a very short sentence", "learn to type today", "this is a typing game", "i like to type", "i have discord nitro", "imagine having discord nitro", "the new discord logo sucks", "do you want free nitro? {NO}"]
const ms = require('ms');
const colors = require('../files/colors.json');

const correctSentence = new discord.MessageEmbed()
    .setDescription("**You typed the correct sentence!**")
    .setColor(colors.COLOR)
const wrongSentence = new discord.MessageEmbed()
    .setDescription("**The sentence you typed is incorrect, you lost!**")
    .setColor(colors.COLOR)

const sentence = sentences[Math.floor(Math.random() * sentences.length)];

module.exports = {
    name: "type",
    aliases: ['type-game', 'typing', 'tgame'],
    async execute(client, message, args) {

        console.log("Command `type` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

        const sentence = sentences[Math.floor(Math.random() * sentences.length)];
        const author = message.author.id

        if (!sentence) return message.channel.send("Could not get a sentence, please try again.");

        const embed = new discord.MessageEmbed()
            .setTitle("Type this sentence")
            .setDescription(`Type this sentence in the next 20 seconds:\n\`${sentence}\``)
            .setColor(colors.COLOR);
        message.channel.send(embed);

        const filter = m => m.author.id === author;
        const collector = message.channel.createMessageCollector(filter, { max: 1, time: 15000 });
        collector.on('collect', m => {
            if (m.content.toLowerCase() === sentence) {
                message.channel.send(correctSentence);
                return;
            } else {
                message.channel.send(wrongSentence);
            }
        });

    }
}
