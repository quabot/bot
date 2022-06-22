const { MessageEmbed } = require('discord.js');
const os = require('os');
const { version } = require('../../structures/settings.json');

module.exports = {
    name: "info",
    description: 'Bot info.',
    async execute(client, interaction, color) {
        try {

            // Sends the info embed.
            let users  = client.users.cache.size;

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`${client.user.username} Info`)
                        .setThumbnail(client.user.avatarURL({ dynamic: true }))
                        .addField("Memory Usage", `\`${Math.round(os.totalmem() / 1024 / 1024) - Math.round(os.freemem() / 1024 / 1024)}MB/${Math.round(os.totalmem() / 1024 / 1024)}MB\``, true)
                        .addField("Uptime", `<t:${parseInt(client.readyTimestamp / 1000)}:R>`, true)
                        .addField('\u200b', '\u200b', true)
                        .addField("Users", `\`${users.toLocaleString()}\``, true)
                        .addField("Servers", `\`${client.guilds.cache.size}\``, true)
                        .addField('\u200b', '\u200b', true)
                        .addField("Discord.js", `\`${require('../../package.json').dependencies['discord.js']}\``, true)
                        .addField("Node.js", `\`${process.version}\``, true)
                        .addField('\u200b', '\u200b', true)
                        .addField("CPU", `\`\`\`${os.cpus()[0].model}\`\`\``, true)
                        .addField('Version', `\`${version}\``, true)
                        .addField('\u200b', '\u200b', true)
                        .addField("Platform", `\`${process.platform.replace('win32', 'Windows')}\``, true)
                        .addField("Ping", `\`${client.ws.ping}ms\``, true)
                        .addField('\u200b', '\u200b', true)
                        .setColor(color)
                ]
            }).catch(( err => { } ))

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
