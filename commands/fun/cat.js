const discord = require('discord.js');
const randomPuppy = require('random-puppy');
const colors = require('../../files/colors.json');

const noPermsAttachFiles = new discord.MessageEmbed()
    .setDescription("I do not have permission to attach files!")
    .setColor(colors.COLOR)
const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const scanning = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription(":mag: Scanning the web for the cutest cat! :cat:")

module.exports = {
    name: "cat",
    aliases: [],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("ATTACH_FILES")) return message.channel.send({ embeds: [noPermsAttachFiles] });

        console.log("Command `cat` was used.");
        message.channel.send({ embeds: [scanning] }).then(msg => {
            setTimeout(async function () {

                const subReddits = ["catpics", "kittens"];
                const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        
                const img = await randomPuppy(random);

                const embed = new discord.MessageEmbed()
                    .setDescription("There you go! :cat:")
                    .setImage(img)
                    .setColor(colors.COLOR);
                msg.edit({ embeds: [embed] });
            });
        }, 2000);
    }
}