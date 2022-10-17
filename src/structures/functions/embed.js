const { EmbedBuilder } = require('discord.js');

function generateEmbed(color, description) {
    if (!color && !description) return;
    const embed = new EmbedBuilder().setColor(color).setDescription(`${description}`);

    return embed;
}

module.exports = { generateEmbed };
