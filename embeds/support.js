const { MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../files/colors.json');

const reportDis = new MessageEmbed().setColor(COLOR_MAIN).setDescription("The reports module is disabled in this guild. Ask an admin to enable it with `/config`. Full guide on setting it up [can be found here](https://wiki.quabot.net/#/modules/suggestions-reports)!");
const reportNoChannel = new MessageEmbed().setColor(COLOR_MAIN).setDescription("There is no reports channel set up. Full guide on setting it up [can be found here](https://wiki.quabot.net/#/modules/suggestions-reports)!");
const reportNoReport = new MessageEmbed().setColor(COLOR_MAIN).setDescription("There was no report content found!");
const ticketDis = new MessageEmbed().setColor(COLOR_MAIN).setDescription("The tickets module is disabled in this guild. Ask an admin to enable it with `/config`. Full guide on setting it up [can be found here](https://wiki.quabot.net/#/modules/tickets)!");
const notATicket = new MessageEmbed().setColor(COLOR_MAIN).setDescription("You are not inside of a ticket right now ⛔!");
const suggestDis = new MessageEmbed().setColor(COLOR_MAIN).setDescription("The suggestions module is disabled in this guild. Ask an admin to enable it with `/config`. Full guide on setting it up [can be found here](https://wiki.quabot.net/#/modules/suggestions-reports)!");

module.exports = { suggestDis, notATicket, ticketDis, reportNoReport, reportNoChannel, reportDis }