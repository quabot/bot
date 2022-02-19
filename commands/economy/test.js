const { MessageAttachment, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');
const { error, added } = require('../../embeds/general');

module.exports = {
    name: "test",
    economy: true,
    aliases: [],
    async execute(client, message, args) {

        let user = message.mentions.users.first();
        if (!user) user = message.author;
        
        const canvacord = require("canvacord");

        let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await canvacord.Canvas.blur(avatar);
        let attachment = new MessageAttachment(image, "blur.gif");
        return message.channel.send({ files: [attachment] });
    }
}