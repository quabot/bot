const { MessageEmbed } = require('discord.js');
const os = require('os');

module.exports = {
    name: "info",
    description: 'Bot info.',
    async execute(client, interaction, color) {
        try {

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`${client.user.username} Info`)
                        .setDescription("**THIS IS A BETA BOT ON A BETA RELEASE**")
                        .setThumbnail(client.user.avatarURL({ dynamic: true }))
                        .addField("Memory Usage", `\`${Math.round(os.totalmem() / 1024 / 1024) - Math.round(os.freemem() / 1024 / 1024)}MB/${Math.round(os.totalmem() / 1024 / 1024)}MB\``, true)
                        .addField("Uptime", `<t:${parseInt(client.readyTimestamp / 1000)}:R>`, true)
                        .addField('\u200b', '\u200b', true)
                        .addField("Users", `\`${client.users.cache.size}\``, true)
                        .addField("Servers", `\`${client.guilds.cache.size}\``, true)
                        .addField('\u200b', '\u200b', true)
                        .addField("Discord.js", `\`${require('../../package.json').dependencies['discord.js']}\``, true)
                        .addField("Node.js", `\`${process.version}\``, true)
                        .addField('\u200b', '\u200b', true)
                        .addField("CPU", "```AMD Ryzen 5 2600```", true)
                        .addField('\u200b', '\u200b', true)
                        .addField('\u200b', '\u200b', true)
                        .addField("Platform", `\`${process.platform.replace('win32', 'Windows')}\``, true)
                        .addField("Ping", `\`${client.ws.ping}ms\``, true)
                        .addField('\u200b', '\u200b', true)
                        .setColor(color)
                ]
            }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
