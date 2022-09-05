const { Client, EmbedBuilder, Colors, Role } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: "roleCreate",
    name: "roleCreate",
    /**
     * @param {Role} role
     * @param {Client} client
     */
    async execute(role, client, color) {

        if (!role.guild) return;

        const logConfig = await getLogConfig(client, role.guild.id);
        if (!logConfig) return;

        const logChannel = await getLogChannel(role.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;

        let description = `**Role Created**\n${role}`;
        let perms = role.permissions.toArray().join("\n")
        let permsLength = String(perms);
        if (permsLength.length < 971) description = `${description}\n\n**Permissions:**\n\`${perms}\``

        logChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`${description}`)
                    .setTimestamp()
                    .setFooter({ text: `Role Name: ${role.name}` })
            ]
        }).catch((e => { }));
    }
}