const Canvas = require("@napi-rs/canvas");
const { readFile } = require('fs/promises');
const { join } = require("path");
const { request } = require('undici');

/**
 * @param {canvas} Canvas.Canvas
 * @returns 
 */

Canvas.GlobalFonts.registerFromPath(join(__dirname, '..', 'assets', 'fonts', 'ggsans-Normal.ttf'), 'GG Sans')
Canvas.GlobalFonts.registerFromPath(join(__dirname, '..', 'assets', 'fonts', 'ggsans-Bold.ttf'), 'GG Sans Bold')


async function drawCard(member, user, level, xp, reqXp) {
    // Defining canvas
    const canvas = Canvas.createCanvas(700, 250);// <- Canvas size here
    const context = canvas.getContext('2d');

    // background option
    if (false) {
        const background = await readFile('./src/utils/assets/backgrounds/wallpaper.jpg');
        const backgroundImage = new Canvas.Image();
        backgroundImage.src = background;
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    // Static Color
    context.fillStyle = "#141414";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //     STROKE (TBF)
    // context.strokeStyle = '#0099ff';
    // context.lineWidth = 10;
    // context.strokeRect(0, 0, canvas.width, canvas.height);

    // context.font = '28px sans-serif';
    // context.fillStyle = '#ffffff';
    // context.fillText('Profile', canvas.width / 2.5, canvas.height / 3.5);

    context.font = '40px GG Sans Bold';
    const levelLength = context.measureText(`${level}`).width;

    context.fillStyle = '#3A5A74';
    context.fillText(`${level}`, canvas.width - context.measureText(`${level}`).width - 25, 50);

    context.font = '25px GG Sans';
    context.fillStyle = '#3A5A74';
    context.fillText(`LEVEL`, canvas.width - context.measureText(`LEVEL`).width - 25 - levelLength, 50);

    
    context.font = '25px GG Sans';
    const reqLength = context.measureText(`${reqXp} XP`).width;
    context.fillStyle = '#fff';
    context.fillText(`${reqXp} XP`, canvas.width - context.measureText(`${reqXp} XP`).width - 25, canvas.height - 85);


    context.font = '25px GG Sans';
    context.fillStyle = '#fff';
    context.fillText(`${xp}/`, canvas.width - context.measureText(`${xp}/`).width - 25 - reqLength, canvas.height - 85);


    context.font = '30px GG Sans Bold';
    context.fillStyle = '#fff';
    context.fillText(`@${user.username}`, 25+120+25, canvas.height - 120);

    context.font = '30px GG Sans';
    context.fillStyle = '#fff';
    context.fillText(`Leveled up!`, 25+120+25, canvas.height - 85);


    context.fillStyle = "#4a4a4a";
    context.beginPath();
    context.roundRect(25, canvas.height - 60, canvas.width - 50, 35, 5);
    context.fill();


    context.beginPath();
    context.arc(85, 110, 60, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    const { body } = await request(user.displayAvatarURL({ format: 'jpg' }));
    const avatar = new Canvas.Image();
    avatar.src = Buffer.from(await body.arrayBuffer());
    context.drawImage(avatar, 25, 25+25, 120, 120);

    // Encodes canvas to png and returns this png
    const result = await canvas.encode('png') // Encodes canvas to png image
    return result;
}

module.exports = { drawCard };