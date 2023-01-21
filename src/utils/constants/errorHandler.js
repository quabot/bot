const { Client, Colors, EmbedBuilder } = require("discord.js");

/**
 * @param {Client} client
 */
const handleError = (client, error, location) => {
    console.log(error);

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const channel = guild.channels.cache.get(process.env.ERROR_CHANNEL_ID);

    channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor(Colors.Red)
                .setFooter({ text: error.name })
                .setTimestamp()
                .setDescription(`\`\`\`${error.message}\`\`\`\n**Location/Command:**\n\`${location}\``),
        ],
    });
}

module.exports = { handleError };