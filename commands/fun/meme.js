const discord = require('discord.js');
const colors = require('../../files/colors.json');
const randomPuppy = require('random-puppy');

const noPermsAttachFiles = new discord.MessageEmbed()
    .setDescription("I do not have permission to attach files!")
    .setColor(colors.COLOR);
const scanning = new discord.MessageEmbed()
    .setDescription(":mag: Scanning for the best memes... :joy:")
    .setColor(colors.COLOR)
module.exports = {
    name: "meme",
    aliases: ["memes"],
    async execute(client, message, args) {

        console.log("Command `meme` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("ATTACH_FILES")) return message.channel.send({ embeds: [noPermsAttachFiles] });

        message.channel.send({ embeds: [scanning] }).then(msg => {
            setTimeout(async function () {

                const subReddits = ["dankmemes", "meme"];
                const random = subReddits[Math.floor(Math.random() * subReddits.length)];

                const img = await randomPuppy(random);

                const embed = new discord.MessageEmbed()
                    .setTitle("There you go! :thumbsup:")
                    .setImage(img)
                    .setColor(colors.COLOR)
                    .setFooter(`Your meme from r/${random}`)
                msg.edit({ embeds: [embed] });
            });
        }, 5000);

    }
}