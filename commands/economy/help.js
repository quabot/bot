const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general');

module.exports = {
    name: "help",
    description: "Help System.",
    economy: true,
    aliases: ['guide', 'economy', 'help-economy'],
    async execute(client, message, args) {

        message.reply("help menu lmaoo")
    }
}