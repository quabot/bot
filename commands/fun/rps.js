const discord = require('discord.js');
const colors = require('../../files/colors.json');

const noPermsMsg = new discord.MessageEmbed()
    .setDescription("I do not have permission to manage messages!")
    .setColor(colors.COLOR);
const noResponse = new discord.MessageEmbed()
    .setTitle("Rock, Paper, Scissors!")
    .setDescription("Please react with rock :rock:, paper :newspaper: or scissors :scissors:!")
    .setColor(colors.COLOR);
const resultTie = new discord.MessageEmbed()
    .setDescription("It's a tie! :worried:")
    .setColor(colors.COLOR);
const youWin = new discord.MessageEmbed()
    .setDescription("You won! :partying_face:")
    .setColor(colors.COLOR);
const youLost = new discord.MessageEmbed()
    .setDescription("You lost! :confused:")
    .setColor(colors.COLOR);
const cancelled = new discord.MessageEmbed()
    .setDescription(":x: Cancelled! You failed to respond in time!")
    .setColor(colors.COLOR);
module.exports = {
    name: "rps",
    aliases: [],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return message.channel.send({ embeds: [noPermsMsg] });

        message.channel.send({ embeds: [noResponse] }).then(msg => {
            msg.react("🪨");
            msg.react("✂️");
            msg.react("📰");

            const filter = (reaction, user) => {
                return ['🪨', '✂️', '📰'].includes(reaction.emoji.name) && user.id === message.author.id;
            }

            const choices = ['🪨', '✂️', '📰'];
            const me = choices[Math.floor(Math.random() * choices.length)];
            msg.awaitReactions({ filter, max: 1, time: 5000, error: ['time'] }).then(
                async (collected) => {
                    const reaction = collected.first();
                    const result = new discord.MessageEmbed()
                        .setTitle("Results")
                        .addField("Your choice:", `${reaction.emoji.name}`)
                        .addField("My choice:", me)
                        .setColor(colors.COLOR)
                    msg.edit({ embeds: [result] });

                    if (reaction.emoji.name === null) return message.channel.send({ embeds: [cancelled] })
                    if ((me === "🪨" && reaction.emoji.name === "✂️") ||
                        (me === "✂️" && reaction.emoji.name === "📰") ||
                        (me === "📰" && reaction.emoji.name === "🪨")) {
                        message.channel.send({ embeds: [youLost] });
                    } else if (me === reaction.emoji.name) {
                        return message.channel.send({ embeds: [resultTie] });
                    } else {
                        return message.channel.send({ content: "THIS COMMAND IS NOT WORKING AT THE MOMENT!", embeds: [youWin] });
                    }
                })
        });
    }
}