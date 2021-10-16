const discord = require('discord.js');
const randomPuppy = require('random-puppy');

const { MemeScanning, MemeNoAttach } = require('../../files/embeds');
const colors = require('../../files/colors.json');

module.exports = {
    name: "meme",
    aliases: [],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("ATTACH_FILES")) return message.channel.send({ embeds: [MemeNoAttach] });

        message.channel.send({ embeds: [MemeScanning] }).then(msg => {
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
            }, 5000);
        });

    }
}