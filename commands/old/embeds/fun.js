const { MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../files/colors.json');

const coin = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🪙 Flipping the coin!");
const catScan = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔍 Searching for cat images!");
const empty = new MessageEmbed().setColor(COLOR_MAIN)
const empty2 = new MessageEmbed().setColor(COLOR_MAIN)
const empty3 = new MessageEmbed().setColor(COLOR_MAIN)
const dogScan = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔍 Searching for dog images!");
const memeScan = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔍 Searching for meme images!");
const rps = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🪨 Rock, 📃 Paper, ✂️ Scissors!");
const lostRock = new MessageEmbed().setColor(COLOR_MAIN).setTitle("You lost!").addField("My Choice", "📃 Paper", true).addField("Your Choice", "🪨 Rock", true);
const tieRock = new MessageEmbed().setColor(COLOR_MAIN).setTitle("Tie!").addField("My Choice", "🪨 Rock", true).addField("Your Choice", "🪨 Rock", true);
const wonRock = new MessageEmbed().setColor(COLOR_MAIN).setTitle("You won!").addField("My Choice", "✂️ Scissors", true).addField("Your Choice", "🪨 Rock", true);
const tiePaper = new MessageEmbed().setColor(COLOR_MAIN).setTitle("Tie!").addField("My Choice", "📃 Paper", true).addField("Your Choice", "📃 Paper", true);
const wonPaper = new MessageEmbed().setColor(COLOR_MAIN).setTitle("You won!").addField("My Choice", "🪨 Rock", true).addField("Your Choice", "📃 Paper", true);
const lostPaper = new MessageEmbed().setColor(COLOR_MAIN).setTitle("You lost!").addField("My Choice", "✂️ Scissors", true).addField("Your Choice", "📃 Paper", true);
const tieScissors = new MessageEmbed().setColor(COLOR_MAIN).setTitle("Tie!").addField("My Choice", "✂️ Scissors", true).addField("Your Choice", "✂️ Scissors", true);
const lostScissors = new MessageEmbed().setColor(COLOR_MAIN).setTitle("You lost!").addField("My Choice", "🪨 Rock", true).addField("Your Choice", "✂️ Scissors", true);
const wonScissors = new MessageEmbed().setColor(COLOR_MAIN).setTitle("You won!").addField("My Choice", "✂️ Scissors", true).addField("Your Choice", "✂️ Scissors", true);
const emptyReddit = new MessageEmbed().setColor(COLOR_MAIN)

module.exports = { empty3, emptyReddit, memeScan, dogScan, catScan, empty, empty2, coin, rps, lostRock, wonRock, tieRock, lostPaper, wonPaper, tiePaper, lostScissors, wonScissors, tieScissors }