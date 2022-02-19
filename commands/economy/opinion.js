const { MessageAttachment, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');
const { error, added } = require('../../embeds/general');

module.exports = {
    name: "opinion",
    economy: true,
    aliases: [],
    async execute(client, message, args) {

        let user = args.join(" ")
        if (!user) return message.channel.send("Give a text!");

        let user2 = message.mentions.users.first();
        
        if (!user2) user2 = message.author;
        
        const canvacord = require("canvacord");

        let avatar = user2.displayAvatarURL({ dynamic: true, format: 'png' });

        let image = await canvacord.Canvas.opinion(avatar, user);
        let attachment = new MessageAttachment(image, "opinion.png");
        return message.channel.send({ files: [attachment] });
    }
}