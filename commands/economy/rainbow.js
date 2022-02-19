const { MessageAttachment, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');
const { error, added } = require('../../embeds/general');

module.exports = {
    name: "rainbow",
    economy: true,
    aliases: ["gay"],
    async execute(client, message, args) {

        let user = message.mentions.users.first();
        if (!user) user = message.author;
        
        const canvacord = require("canvacord");

        let avatar = user.displayAvatarURL({ dynamic: true, format: 'png' });
        let image = await canvacord.Canvas.rainbow(avatar);
        let attachment = new MessageAttachment(image, "rainbow.png");
        return message.channel.send({ files: [attachment] });
    }
}