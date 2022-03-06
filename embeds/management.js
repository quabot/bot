const { MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../files/colors.json');

const noAmount = new MessageEmbed().setColor(COLOR_MAIN).setTitle("Please give an amount of messages to clear between 1-200");
const config = new MessageEmbed().setTitle("Quabot configuration").setColor(COLOR_MAIN).setThumbnail("https://i.imgur.com/0vCe2oB.png").addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.net) - [Website](https://quabot.net)").setDescription("Configure quabot to be perfect for your server. Select a category using the dropdown.")
const noChannel = new MessageEmbed().setColor(COLOR_MAIN).setDescription("You can only lock Text And Voice channels.")

module.exports = { config, noAmount, noChannel }