const { MessageAttachment, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');
const { error, added } = require('../../embeds/general');

module.exports = {
    name: "changemymind",
    economy: true,
    aliases: [],
    async execute(client, message, args) {

        let user = args.join(" ")
        if (!user) return message.channel.send("Give a text!");
        
        const canvacord = require("canvacord");

        let image = await canvacord.Canvas.changemymind(user);
        let attachment = new MessageAttachment(image, "changemymind.gif");
        return message.channel.send({ files: [attachment] });
    }
}