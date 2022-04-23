const { MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../files/colors.json');

const musicDisabled = new MessageEmbed().setColor(COLOR_MAIN).setDescription("The music module is disabled in this guild. Ask an admin to enable it with `/config`.")
const notVoice = new MessageEmbed().setColor(COLOR_MAIN).setDescription("You are not in a voice channel.")
const noSongs = new MessageEmbed().setColor(COLOR_MAIN).setDescription("There are no songs in queue.")

module.exports = { noSongs, notVoice, musicDisabled }