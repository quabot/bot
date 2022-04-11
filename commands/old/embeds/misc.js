const { MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../files/colors.json');

const avatar = new MessageEmbed().setColor(COLOR_MAIN).setTitle('Avatar')
module.exports = { avatar }