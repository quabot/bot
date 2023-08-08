const discord = require('discord.js');
const colors = require('../files/colors.json');
const randomPuppy = require('random-puppy');

const noPermsAttachFiles = new discord.MessageEmbed()
    .setDescription("I do not have permission to attach files!")
    .setColor(colors.COLOR);
module.exports = {
    name: "meme",
    aliases: ["memes"],
    async execute(client, message, args) {

        console.log("Command `meme` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!message.guild.me.hasPermission("ATTACH_FILES")) return message.channel.send(noPermsAttachFiles);

        const subReddits = ["dankmeme", "memes"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];

        const img = await randomPuppy(random);

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setImage(img)
            .setDescription(`Your meme from r/${random}`)
            .setURL(`https://reddit.com/r/${random}`);
        message.channel.send(embed);

    }
}