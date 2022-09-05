const { Interaction, EmbedBuilder, Client } = require('discord.js');
const { VERSION } = require('../../../structures/config.json');
const os = require('os');

module.exports = {
    name: "bot",
    command: "info",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((err => { }));
        
        if (!client.cache.has("info")) client.cache.set("info", {
            djs: require('../../../../package.json').dependencies['discord.js'],
            njs: process.version,
            cpu: os.cpus()[0].model,
            platform: process.platform.replace('win32', 'Windows')
        });

        const info = client.cache.get("info");
        
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`${client.user.username} Info`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: "Memory Usage", value: `\`${Math.round(os.totalmem() / 1024 / 1024) - Math.round(os.freemem() / 1024 / 1024)}MB/${Math.round(os.totalmem() / 1024 / 1024)}MB\``, inline: true },
                        { name: "Uptime", value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "Users", value: `\`${client.users.cache.size.toLocaleString()}\``, inline: true },
                        { name: "Servers", value: `\`${client.guilds.cache.size.toLocaleString()}\``, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "Discord.js", value: `\`${info.djs}\``, inline: true },
                        { name: "Node.js", value: `\`${info.njs}\``, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "CPU", value: `\`\`\`${info.cpu}\`\`\``, inline: true },
                        { name: 'Version', value: `\`${VERSION}\``, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "Platform", value: `\`${info.platform}\``, inline: true },
                        { name: "Ping", value: `\`${client.ws.ping}ms\``, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                    )
                    .setTimestamp()
            ]
        }).catch((err => { }));
    }
}