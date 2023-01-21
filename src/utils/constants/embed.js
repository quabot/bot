const { EmbedBuilder } = require('discord.js');

class Embed extends EmbedBuilder {
    constructor(color) {
        super();

        return new EmbedBuilder().setTimestamp().setColor(color).setFooter({
            text: 'quabot.net',
            iconURL: 'https://i.imgur.com/zDx61ID.png',
        });
    }
}

module.exports = { Embed };