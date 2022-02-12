const { MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../files/colors.json');

const error = new MessageEmbed().setColor(COLOR_MAIN).setTitle("❌ There was an error!").setDescription("Developers are aware of this issue, and it will be fixed soon.");
const added = new MessageEmbed().setColor(COLOR_MAIN).setDescription("✅ Added to the database.");
const guildAdd = new MessageEmbed()
    .setColor(COLOR_MAIN)
    .setTitle("Thank you for adding QuaBot.")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription("You've added quabot to this guild. QuaBot is an advanced bot with loads of features, such as music, welcome messages, reactionh roles, logging and a lot more! Use `/config` to configure all features.")
    .addField("Quick Links", `<:site:941723310440456293> Website: https://quabot.net\n<:ezgif:941723896871276594> Commands: https://wiki.quabot.net/\n<:thread:941403540327391282> Discord: https://discord.gg/FeBJjUZZ58`)
    .setTimestamp()

module.exports = { guildAdd, error, added }