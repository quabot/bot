const discord = require('discord.js');
const { getPost, getImage } = require('random-reddit')

const { PornScanning, MemeNoAttach } = require('../../files/embeds');
const colors = require('../../files/colors.json');

module.exports = {
    name: "porn",
    aliases: [],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("ATTACH_FILES")) return message.channel.send({ embeds: [MemeNoAttach] });

        message.channel.send({ embeds: [PornScanning] }).then(msg => {
            setTimeout(async function () {

                let options = {
                    imageOnly: true,
                    allowNSFW: true
                 };

                function getImage(options) {
                    const image = getImage('gonewild', options)                    
                }

                const embed = new discord.MessageEmbed()
                    .setTitle("There you go! :thumbsup:")
                    .setImage(image)
                    .setColor(colors.COLOR)
                    .setFooter(`-`)
                msg.edit({ embeds: [embed] });
            }, 5000);
        });

    }
}