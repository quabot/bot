const { MessageAttachment, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');
const { error, added } = require('../../embeds/general');

module.exports = {
    name: "jokeoverhead",
    economy: true,
    aliases: [],
    async execute(client, message, args) {

        let user = message.mentions.users.first();
        if (!user) user = message.author;
        
        const canvacord = require("canvacord");

        let avatar = user.displayAvatarURL({ dynamic: true, format: 'png' });
        let image = await canvacord.Canvas.jokeOverHead(avatar);
        let attachment = new MessageAttachment(image, "jokeoverhead.png");
        return message.channel.send({ files: [attachment] });
    }
}