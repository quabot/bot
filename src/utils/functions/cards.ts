import type { LevelCard, WelcomeCard } from '@typings/mongoose';
import type { GuildMember } from 'discord.js';

import Canvas from '@napi-rs/canvas';
import { readFile } from 'fs/promises';
import { join } from 'path';
import moment from 'moment';
import { request } from 'undici';

const baseFontPath = join(__dirname, '../assets/fonts');
Canvas.GlobalFonts.registerFromPath(join(baseFontPath, 'ggsans-Normal.ttf'), 'GG Sans');
Canvas.GlobalFonts.registerFromPath(join(baseFontPath, 'ggsans-Bold.ttf'), 'GG Sans Bold');
Canvas.GlobalFonts.registerFromPath(join(baseFontPath, 'ggsans-SemiBold.ttf'), 'GG Sans SemiBold');
Canvas.GlobalFonts.registerFromPath(join(baseFontPath, 'ggsans-Medium.ttf'), 'GG Sans Medium');

export async function drawLevelCard(member: GuildMember, level: number, xp: number, reqXp: number, options: LevelCard) {
  // Destructuring user
  const { user } = member;

  // Defining canvas
  const canvas = Canvas.createCanvas(719, 251); // <- Canvas size here
  const context = canvas.getContext('2d');

  // Background
  if (options.bg.type === 'color') {
    // Static Color BG
    context.fillStyle = options.bg.color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  } else if (options.bg.type === 'image') {
    // do imgs
    let background = await readFile(`./src/utils/assets/backgrounds/${options.bg.image}.jpg`).catch(() => {});
    if (!background) background = await readFile('./src/utils/assets/backgrounds/fallback.jpg');
    const backgroundImage = new Canvas.Image();
    backgroundImage.src = background;
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    context.fillStyle = options.bg.image_overlay;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Stroke/Border
  if (options.border.enabled) {
    context.strokeStyle = options.border.color;
    context.lineWidth = options.border.size;
    context.strokeRect(0, 0, canvas.width, canvas.height);
  }

  // "Displayname"
  context.font = '32px GG Sans Bold';
  context.fillStyle = options.colors.displayname;
  const usernameWidth = context.measureText(user.displayName).width;
  context.fillText(`${user.displayName}`, 166, 51 + 43 / 2);
  // Username & Joined Date
  context.font = '28px GG Sans';
  context.fillStyle = options.colors.username;
  context.fillText(
    `@${user.username} • Joined ${moment(member.joinedTimestamp).format('MMM D, YYYY')}`,
    166,
    90 + 37 / 2,
  );

  // XP BAR
  const percent = xp / reqXp;

  context.fillStyle = options.colors.xp_bar;
  context.beginPath();
  context.roundRect(
    35,
    canvas.height - 48,
    canvas.width - 70,
    13,
    100,
    // @ts-ignore
    Math.max((canvas.width - 70) * percent, canvas.width - 70), //? why even is this here, roundRect() only takes 4-5 args? Joas says it works
  );
  context.fill();

  let width = (canvas.width - 70) * percent;
  if (width > canvas.width - 70) width = canvas.width - 70;

  context.fillStyle = options.colors.accent;
  context.beginPath();
  context.roundRect(35, canvas.height - 48, width, 13, 100);
  context.fill();

  // Bottom XP/LV info
  // XP Counter
  context.font = '24px GG Sans';
  context.fillStyle = options.colors.xp;
  context.fillText(`${xp} XP`, 32, 162 + 16);
  // "until next level"
  context.font = '24px GG Sans';
  context.fillStyle = options.colors.xp;
  context.fillText(
    `${reqXp - xp} XP until next level`,
    canvas.width - 40 - context.measureText(`${reqXp - xp} XP until next level`).width,
    162 + 16,
  );

  // Level
  context.font = '24px GG Sans';
  const levelWidth = context.measureText(`LEVEL ${level}`).width;
  // Level blob
  context.fillStyle = options.colors.level_bg;
  context.beginPath();
  context.roundRect(102 + 33 + 32 + usernameWidth + 15, 11.75 * 3 + 8, levelWidth + 16 + 17, 39, 100);
  context.fill();
  // Level text
  context.fillStyle = options.colors.level_text;
  context.fillText(`LEVEL ${level}`, 102 + 33 + 32 + usernameWidth + 32, 48 + 32 / 2 + 8);

  // Profile Picture
  // Make it rounded (if enabled)
  if (options.pfp.rounded) {
    context.beginPath();
    context.arc(83, 83, 51, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
  }

  // Drawing pfp image itself
  const { body } = await request(user.displayAvatarURL({ extension: 'jpg' }));
  const avatar = new Canvas.Image();
  avatar.src = Buffer.from(await body.arrayBuffer());
  context.drawImage(avatar, 32, 32, 102, 102);

  // Exporting it as PNG image
  const result = await canvas.encode('png');
  return result;
}

export async function drawWelcomeCard(member: GuildMember, options: WelcomeCard) {
  // Defining canvas
  const canvas = Canvas.createCanvas(719, 288); // <- Canvas size here
  const context = canvas.getContext('2d');

  // Background
  if (options.bg.type === 'color') {
    // Static Color BG
    context.fillStyle = options.bg.color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  } else if (options.bg.type === 'image') {
    // do imgs
    let background = await readFile(`./src/utils/assets/backgrounds/${options.bg.image}.jpg`).catch(() => {});
    if (!background) background = await readFile('./src/utils/assets/backgrounds/fallback.jpg');
    const backgroundImage = new Canvas.Image();
    backgroundImage.src = background;
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    context.fillStyle = options.bg.image_overlay;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Stroke/Border
  if (options.border.enabled) {
    context.strokeStyle = options.border.color;
    context.lineWidth = options.border.size;
    context.strokeRect(0, 0, canvas.width, canvas.height);
  }

  //* Welcome Person
  if (options.welcomeTxt.enabled) {
    const welcomeTxt = parseString(options.welcomeTxt.value);
    context.font = `32px GG Sans ${options.welcomeTxt.weight}`;
    context.fillStyle = options.welcomeTxt.color;
    context.fillText(
      welcomeTxt,
      canvas.width / 2 - context.measureText(welcomeTxt).width / 2,
      //location + size - size / 5
      139 + 39 - 39 / 5,
    );
  }

  //* You are member
  if (options.memberTxt.enabled) {
    const memberTxt = parseString(options.memberTxt.value);
    context.font = `28px GG Sans ${options.memberTxt.weight}`;
    context.fillStyle = options.memberTxt.color;
    context.fillText(
      memberTxt,
      canvas.width / 2 - context.measureText(memberTxt).width / 2,
      //location + size - size / 5
      183 + 34 - 34 / 5,
    );
  }

  //* Custom
  if (options.customTxt.enabled) {
    const customTxt = parseString(options.customTxt.value);
    context.font = '28px Inter';
    context.fillStyle = options.customTxt.color;
    context.fillText(
      customTxt,
      canvas.width / 2 - context.measureText(customTxt).width / 2,
      //location + size - size / 5
      222 + 34 - 34 / 5,
    );
  }

  //* Avatar
  const AVATAR_POS = [309, 32];
  const AVATAR_SIZE = 102;
  const avatarRadius = AVATAR_SIZE / 2;
  // Profile Picture
  // Make it rounded (if enabled)
  if (options.pfp.rounded) {
    context.beginPath();
    context.arc(AVATAR_POS[0] + avatarRadius, AVATAR_POS[1] + avatarRadius, avatarRadius, 0, Math.PI * 2, true);
    // context.stroke();
    context.closePath();
    context.clip();
  }

  // Drawing pfp image itself
  const { body } = await request(member.displayAvatarURL({ extension: 'jpg' }));
  const avatar = new Canvas.Image();
  avatar.src = Buffer.from(await body.arrayBuffer());
  context.drawImage(avatar, AVATAR_POS[0], AVATAR_POS[1], AVATAR_SIZE, AVATAR_SIZE);

  // Exporting it as PNG image
  const result = await canvas.encode('png');
  return result;

  function parseString(str: string) {
    const { createdAt } = member.user;
    return str
      .replaceAll('{server.name}', member.guild.name)
      .replaceAll('{server.id}', member.guild.id)
      .replaceAll('{server.members}', member.guild.memberCount.toString())
      .replaceAll('{server.channels}', member.guild.channels.cache.size.toString())
      .replaceAll('{server.owner}', member.guild.members.cache.get(member.guild.ownerId)?.displayName ?? '')
      .replaceAll('{user.username}', member.user.username)
      .replaceAll('{user.displayname}', member.user.displayName)
      .replaceAll('{user.display_name}', member.user.displayName)
      .replaceAll('{user.id}', member.id)
      .replaceAll(
        '{user.createdAt}',
        `${createdAt.getDate()} ${
          [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ][createdAt.getMonth()]
        } ${createdAt.getFullYear()}`,
      )
      .replaceAll('{user.global_name}', member.user.globalName ?? member.user.displayName)
      .replaceAll('{user.globalname}', member.user.globalName ?? member.user.displayName);
  }
}
