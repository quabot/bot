const Canvas = require("@napi-rs/canvas");
const { readFile } = require('fs/promises');
const { join } = require("path");
const moment = require('moment');
const { request } = require('undici');

/**
 * @param {canvas} Canvas.Canvas
 * @returns 
 */

Canvas.GlobalFonts.registerFromPath(join(__dirname, '..', 'assets', 'fonts', 'ggsans-Normal.ttf'), 'GG Sans')
Canvas.GlobalFonts.registerFromPath(join(__dirname, '..', 'assets', 'fonts', 'ggsans-Bold.ttf'), 'GG Sans Bold')


async function drawCard(member, user, level, xp, reqXp, options) {
    // Defining canvas
    const canvas = Canvas.createCanvas(719, 251);// <- Canvas size here
    const context = canvas.getContext('2d');


    // Background
    if (options.bg_type === 'color') {
        // Static Color BG
        context.fillStyle = options.bg_color;
        context.fillRect(0, 0, canvas.width, canvas.height);
    } else if (options.bg_type === 'image') {
        // do imgs
        const background = await readFile('./src/utils/assets/backgrounds/wallpaper.jpg');
        const backgroundImage = new Canvas.Image();
        backgroundImage.src = background;
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }



    //     STROKE (TBF)
    // context.strokeStyle = '#0099ff';
    // context.lineWidth = 10;
    // context.strokeRect(0, 0, canvas.width, canvas.height);

    // context.font = '28px sans-serif';
    // context.fillStyle = '#ffffff';
    // context.fillText('Profile', canvas.width / 2.5, canvas.height / 3.5);



    // "Displayname"
    context.font = '32px GG Sans Bold';
    context.fillStyle = '#fff';
    const usernameWidth = context.measureText(user.username).width;
    context.fillText(`${user.username}`, 166, 51 + 43 / 2);
    // Username & Joined Date
    context.font = '28px GG Sans';
    context.fillStyle = '#B5B9BF';
    context.fillText(`@${user.username} • Joined ${moment(member.joinedTimestamp).format("MMM D, YYYY")}`, 166, 90 + 37 / 2);



    // XP BAR
    const percent = xp / reqXp;

    context.fillStyle = "#1E1F22";
    context.beginPath();
    context.roundRect(35, canvas.height - 48, canvas.width - 70, 13, 100, Math.max((canvas.width - 70) * percent, canvas.width - 70));
    context.fill();

    let width = (canvas.width - 70) * percent;
    if (width > canvas.width - 70) width = canvas.width - 70;

    context.fillStyle = "#37CF74";
    context.beginPath();
    context.roundRect(35, canvas.height - 48, width, 13, 100);
    context.fill();


    // Bottom XP/LV info
    // XP Counter
    context.font = '24px GG Sans';
    context.fillStyle = '#fff';
    context.fillText(`${xp} XP`, 32, 162 + 16);
    // "until next level"
    context.font = '24px GG Sans';
    context.fillStyle = '#fff';
    context.fillText(`${reqXp - xp} XP until next level`, canvas.width - 40 - context.measureText(`${reqXp - xp} XP until next level`).width, 162 + 16);



    // Level
    context.font = '24px GG Sans';
    const levelWidth = context.measureText(`LEVEL ${level}`).width;
    // Level blog
    context.fillStyle = "#1E1F22";
    context.beginPath();
    context.roundRect(102 + 33 + 32 + usernameWidth + 15, 11.75*3 + 8, levelWidth + 16 + 17, 39, 100);
    context.fill();
    // Level text
    context.fillStyle = '#B5B9BF';
    context.fillText(`LEVEL ${level}`, 102 + 33 + 32 + usernameWidth + 32, 48 + 32 / 2 + 8);


    // Profile Picture
    // Make it rounded
    context.beginPath();
    context.arc(83, 83, 51, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    // Drawing pfp image itself
    const { body } = await request(user.displayAvatarURL({ format: 'jpg' }));
    const avatar = new Canvas.Image();
    avatar.src = Buffer.from(await body.arrayBuffer());
    context.drawImage(avatar, 32, 32, 102, 102);



    // Exporting it as PNG image
    const result = await canvas.encode('png');
    return result;
}

module.exports = { drawCard };