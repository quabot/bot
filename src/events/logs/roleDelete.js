const { Client, Events, Colors, Role } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
	event: Events.GuildRoleDelete,
	name: 'roleDelete',
	/**
     * @param {Role} role
     * @param {Client} client 
     */
	async execute(role, client) {
		try {
			if (!role.guild.id) return;
		} catch (e) {
			// no
		}

		const config = await getLoggingConfig(client, role.guild.id);
		if (!config) return;
		if (!config.enabled) return;

		if (!config.events.includes('roleDelete')) return;


		const channel = role.guild.channels.cache.get(config.channelId);
		if (!channel) return;

		let description = '';
		const perms = role.permissions.toArray().join('\n');
		const permsLength = String(perms);
		if (permsLength.length < 970 && permsLength.length !== 0) description += `\n**Permissions:**\n${perms}`;

		await channel.send({
			embeds: [
				new Embed(role.hexColor)
					.setDescription(`
                        **Role Deleted**
                        @${role.name}
                        `)
			]
		});
	}
};