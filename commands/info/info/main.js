const { EmbedBuilder } = require('discord.js');
const os = require('os');
const { VERSION } = require('../../../structures/settings.json');

module.exports = {
    name: "info",
    description: 'Bot info.',
    async execute(client, interaction, color) {

        let users = client.users.cache.size;

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${client.user.username} Info`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: "Memory Usage", value: `\`${Math.round(os.totalmem() / 1024 / 1024) - Math.round(os.freemem() / 1024 / 1024)}MB/${Math.round(os.totalmem() / 1024 / 1024)}MB\``, inline: true },
                        { name: "Uptime", value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "Users", value: `\`${users.toLocaleString()}\``, inline: true },
                        { name: "Servers", value: `\`${client.guilds.cache.size}\``, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "Discord.js", value: `\`${require('../../../package.json').dependencies['discord.js']}\``, inline: true },
                        { name: "Node.js", value: `\`${process.version}\``, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "CPU", value: `\`\`\`${os.cpus()[0].model}\`\`\``, inline: true },
                        { name: 'Version', value: `\`${VERSION}\``, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "Platform", value: `\`${process.platform.replace('win32', 'Windows')}\``, inline: true },
                        { name: "Ping", value: `\`${client.ws.ping}ms\``, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                    )
                    .setColor(color)
            ]
        }).catch((err => { }))

    }
}
