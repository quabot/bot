const { MessageAttachment, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');
const Canvas = require('canvas');

const { error, added } = require('../../embeds/general');

module.exports = {
    name: "communism",
    economy: true,
    aliases: [],
    async execute(client, message, args) {

        let user = message.mentions.users.first();

        if (!user) user = message.author;

        const myImg1 = await Canvas.loadImage('./images/communism.jpg');
        const myImg2 = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));

        var canvas = Canvas.createCanvas(500, 500);
        var context = canvas.getContext("2d");
  
        // width and height
        var w = 500;
        var h = 500;
  
        canvas.width = w;
        canvas.height = h;
  
        var pixels = 4 * w * h;
        context.drawImage(myImg1, 25, 25, 500, 500);
  
        var image1 = context.getImageData(0, 0, w, h);
        var imageData1 = image1.data;
        context.drawImage(myImg2, 25, 25, 500, 500);
  
        var image2 = context.getImageData(0, 0, w, h);
        var imageData2 = image2.data;
  
        while (pixels--) {
           imageData1[pixels] = imageData1[pixels] * 0.5 + imageData2[pixels] * 0.5;
        }
        image1.data = imageData1;
        context.putImageData(image1, 0, 0);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'gay-user.png');

        message.channel.send({ files: [attachment] });
    }
}