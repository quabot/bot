const discord = require('discord.js');
const colors = require('./colors.json');

const noPermsBanBot = new discord.MessageEmbed()
    .setDescription("I do not have permission to ban members!")
    .setColor(colors.COLOR)
module.exports = (noPermsBanBot);

const noPermsBanUser = new discord.MessageEmbed()
    .setDescription("You do not have permission to ban members!")
    .setColor(colors.COLOR)
module.exports = (noPermsBanUser);

const noUserToBan = new discord.MessageEmbed()
    .setDescription("Please mention a user you want to ban!")
    .setColor(colors.COLOR)
module.exports = (noUserToBan);

const noPermsAttachFiles = new discord.MessageEmbed()
    .setDescription("I do not have permission to attach files!")
    .setColor(colors.COLOR)
module.exports = (noPermsAttachFiles);

const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
module.exports = (errorMain);

const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
module.exports = (addedDatabase);

const noPermsAdminUser = new discord.MessageEmbed()
    .setDescription("You do not have administrator permissions.")
    .setColor(colors.COLOR)
module.exports = (noPermsAdminUser);

const noPermsMsg = new discord.MessageEmbed()
    .setDescription("I do not have permission to manage messages!")
    .setColor(colors.COLOR)
module.exports = (noPermsMsg);

const noAmountMsg = new discord.MessageEmbed()
    .setDescription("Please enter an amount of messages to be cleared!")
    .setColor(colors.COLOR)
module.exports = (noAmountMsg);

const msg100Max = new discord.MessageEmbed()
    .setDescription("Please enter a value between 0-100!")
    .setColor(colors.COLOR)
module.exports = (msg100Max);

const noPunishment = new discord.MessageEmbed()
    .setDescription("Please enter either `warn, kick or mute`!")
    .setColor(colors.COLOR)
module.exports = (noPunishment);

const noUser = new discord.MessageEmbed()
    .setDescription("Please enter a valid user!")
    .setColor(colors.COLOR)
module.exports = (noUser);

const Flipping = new discord.MessageEmbed()
    .setDescription("Flipping...")
    .setColor(colors.COLOR)
module.exports = (Flipping);