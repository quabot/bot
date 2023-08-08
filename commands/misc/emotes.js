const discord = require('discord.js');
const colors = require('../files/colors.json');

const invalidEmote = new discord.MessageEmbed()
    .setDescription("The emote you entered is not valid!")
    .setColor(colors.COLOR);

module.exports = {
    name: "emotes",
    aliases: ['emoji', 'emote', 'emojis'],
    async execute(client, message, args) {

        console.log("Command `emotes` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

        const emoji = args[0]
        if (emoji) {
            const emojiId = message.guild.emojis.cache.find(emoji => emoji.name == args[0])

            if (!emojiId) return message.channel.send(invalidEmote);


            if (message.guild.id == message.member.guild.id) {
                const embed = new discord.MessageEmbed()
                    .setDescription(`**Information about the ${args[0]} emote:**\n\n` + `<:${emoji}:` + emojiId + `>` + ` - ID: ` + emojiId)
                    .setColor(colors.COLOR)
                message.channel.send(embed);
            }

        }

        if (!emoji) {
            const emojiList = message.guild.emojis.cache.map(e => e.toString() + " " + e.name).join(`  -  `);

            const embed1 = new discord.MessageEmbed()
                .setDescription("**Custom emote list: **\n\n" + emojiList, { split: true })
                .setColor(colors.COLOR)
            message.channel.send(embed1);
            return;
        }


    }
}