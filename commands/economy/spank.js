const { MessageAttachment, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');
const { error, added } = require('../../embeds/general');

module.exports = {
    name: "spank",
    economy: true,
    aliases: [],
    async execute(client, message, args) {

        let user = message.mentions.users.first();
        if (!user) return message.channel.send("I need a user to spank");
        
        const canvacord = require("canvacord");

        let avatar = message.author.displayAvatarURL({ dynamic: true, format: 'png' });
        let avatar2 = user.displayAvatarURL({ dynamic: true, format: 'png' });
        let image = await canvacord.Canvas.spank(avatar, avatar2);
        let attachment = new MessageAttachment(image, "spank.png");
        return message.channel.send({ files: [attachment] });
    }
}