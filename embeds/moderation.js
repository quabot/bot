const { MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../files/colors.json');

const banNoUser = new MessageEmbed().setDescription(`Could not find that user.`).setColor(COLOR_MAIN);
const banImpossible = new MessageEmbed().setDescription(`Could not ban that user.`).setColor(COLOR_MAIN);
const kickNoUser = new MessageEmbed().setDescription(`Could not find that user.`).setColor(COLOR_MAIN);
const kickImpossible = new MessageEmbed().setDescription(`Could not punish that user.`).setColor(COLOR_MAIN);
const banTime = new MessageEmbed().setDescription(`Please give a valid time to ban.`).setColor(COLOR_MAIN);
const timoutTime = new MessageEmbed().setDescription(`Please give a valid time to timeout.`).setColor(COLOR_MAIN);

module.exports = { timoutTime, banTime, kickImpossible, kickNoUser, banImpossible, banNoUser }