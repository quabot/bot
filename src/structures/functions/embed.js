const { EmbedBuilder } = require('discord.js');

function generateEmbed(color, description) {
    if (!color || !description) return;
    const embed = new EmbedBuilder().setColor(color).setTimestamp().setDescription(`${description}`).setFooter({ text: 'quabot.net', iconURL: 'https://images-ext-1.discordapp.net/external/Eb7UTgAZjRli_Q-Wi3T0ttLuzyuDP-2Hi78-rNcW2f8/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/995243562134409296/b490d5cd8983d4f22f265c6548e53507.webp?width=663&height=663' });

    return embed;
}

module.exports = { generateEmbed };
