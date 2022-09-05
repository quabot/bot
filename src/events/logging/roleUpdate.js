const { Client, EmbedBuilder, Colors, Role } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: "roleUpdate",
    name: "roleUpdate",
    /**
     * @param {Role} newRole
     * @param {Role} oldRole
     * @param {Client} client
     */
    async execute(oldRole, newRole, client, color) {

        if (!newRole.guild) return;

        const logConfig = await getLogConfig(client, newRole.guild.id);
        if (!logConfig) return;

        const logChannel = await getLogChannel(newRole.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;

        let description = `**Role Edited**\n${newRole}`;
        if (oldRole.mentionable !== newRole.mentionable) description = `${description}\n\n**Mentionable**\n\`${oldRole.mentionable ? "Yes" : "No"}\` -> \`${newRole.mentionable ? "Yes" : "No"}\``;
        if (oldRole.name !== newRole.name) description = `${description}\n\n**Name:**\n\`${oldRole.name}\` -> \`${newRole.name}\``;
        if (oldRole.hoist !== newRole.hoist) description = `${description}\n\n**Seperated in sidebar**\n\`${oldRole.hoist ? "Yes" : "No"}\` -> \`${newRole.hoist ? "Yes" : "No"}\``;
        if (oldRole.position !== newRole.position) return;
        if (oldRole.rawPosition !== newRole.rawPosition) return;
        if (oldRole.icon !== newRole.icon) return;
        if (oldRole.managed !== newRole.managed) return;

        const embed = new EmbedBuilder()
            .setColor(`${newRole.hexColor}`)
            .setDescription(`${description}`)
            .setTimestamp()
            .setFooter({ text: `${newRole.name}` });

        let oldPerms = oldRole.permissions.toArray().join("\n");
        let oldPermsLength = String(oldPerms);
        let newPerms = newRole.permissions.toArray().join("\n");
        let newPermsLength = String(newPerms);
        if (oldPermsLength.length < 1024 && newPermsLength.length < 1024 && oldPerms !== newPerms) embed.addFields(
            { name: "Old Permissions", value: `\`${oldPerms}\``, inline: true },
            { name: "New Permissions", value: `\`${newPerms}\``, inline: true }
        );

        logChannel.send({
            embeds: [embed]
        }).catch((e => { }));
    }
}