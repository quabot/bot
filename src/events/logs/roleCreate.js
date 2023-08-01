const { Client, Events, Colors, Role } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
    event: Events.GuildRoleCreate,
    name: "roleCreate",
    /**
     * @param {Role} role
     * @param {Client} client 
     */
    async execute(role, client) {
		try {
			if (role.guild.id) return;
		} catch (e) { }

        const config = await getLoggingConfig(client, role.guild.id);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.events.includes('roleCreate')) return;


        const channel = role.guild.channels.cache.get(config.channelId);
        if (!channel) return;

        let description = '';
        let perms = role.permissions.toArray().join('\n');
        let permsLength = String(perms);
        if (permsLength.length < 970 && permsLength.length !== 0) description += `\n**Permissions:**\n${perms}`;

        await channel.send({
            embeds: [
                new Embed(Colors.Green)
                    .setDescription(`
                        **Role Created**
                        ${role}
                        ${description}
                        `)
                    .setFooter({ text: `@${role.name}` }),
            ]
        });
    }
}