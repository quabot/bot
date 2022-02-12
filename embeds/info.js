const { MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../files/colors.json');

const dependencies = new MessageEmbed().setColor(COLOR_MAIN).setTitle('Dependencies').setDescription("QuaBot has a total of `35` dependencies.")
const main = new MessageEmbed().setColor(COLOR_MAIN).setTimestamp().setTitle("Select a category of commands using the dropdown.").setDescription("When selecting a category you'll get a detailed list of commands within that category.").addField("Quick Links", "[Invite me](https://discord.com/oauth2/authorize?client_id=845603702210953246&scope=bot%20applications.commands&permissions=346268609631) - [Website](https://quabot.net/) - [Discord](https://discord.gg/Nwu9DNjYa9)").setThumbnail("https://i.imgur.com/jgdQUul.png");
const invite = new MessageEmbed().setColor(COLOR_MAIN).setDescription(`Invite me here: [Click Me](https://discord.com/oauth2/authorize?client_id=845603702210953246&scope=bot%20applications.commands&permissions=346268609631&redirect_uri=https://quabot.net/added.html&response_type=code)`);
const levelDisabled = new MessageEmbed().setColor(COLOR_MAIN).setDescription("The Levels module is enabled on this guild. Ask an admin to enable it with `/config`.")
const noLeaderboard = new MessageEmbed().setColor(COLOR_MAIN).setDescription("Nobody has XP, chat to get on the leaderboard!")
const nickLength = new MessageEmbed().setColor(COLOR_MAIN).setDescription("That nickname is too long!")
const nickNoPerms = new MessageEmbed().setColor(COLOR_MAIN).setDescription("I cannot change that user's nickname.")
const pingGet = new MessageEmbed().setColor(COLOR_MAIN).setTitle("<a:typing:938820557917532231> Getting ping...")
const support = new MessageEmbed().setColor(COLOR_MAIN).setThumbnail("https://i.imgur.com/jgdQUul.png").setTimestamp().setDescription("**Do you need support?**\n\nIf you run into an issue, have a question or just wanna chat with people you can join our support discord.\nBot downtime, updates and more are also announced here.\n\nInvite: https://discord.gg/Nwu9DNjYa9");

module.exports = { support, pingGet, dependencies, main, invite,levelDisabled, nickNoPerms, noLeaderboard, nickLength }