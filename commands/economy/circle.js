const { MessageAttachment, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');
const { error, added } = require('../../embeds/general');

module.exports = {
    name: "circle",
    economy: true,
    aliases: [],
    async execute(client, message, args) {

        let user = message.mentions.users.first();
        if (!user) user = message.author;
        
        const canvacord = require("canvacord");

        let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await canvacord.Canvas.circle(avatar);
        let attachment = new MessageAttachment(image, "circle.gif");
        return message.channel.send({ files: [attachment] });
    }
}