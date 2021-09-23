const discord = require('discord.js');
const randomPuppy = require('random-puppy');

const colors = require('../../files/colors.json');
const {CatNoFiles, CatScanning} = require('../../files/embeds');

module.exports = {
    name: "cat",
    aliases: ["kitten"],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("ATTACH_FILES")) return message.channel.send({ embeds: [CatNoFiles] });

        message.channel.send({ embeds: [CatScanning] }).then(msg => {
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