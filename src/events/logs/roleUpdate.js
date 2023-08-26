const { Client, Events, Colors, Role } = require('discord.js');
const { getLoggingConfig } = require('@configs/loggingConfig');
const { Embed } = require('@constants/embed');

module.exports = {
	event: Events.GuildRoleUpdate,
	name: 'roleUpdate',
	/**
     * @param {Role} oldRole
     * @param {Role} newRole
     * @param {Client} client 
     */
	async execute(oldRole, newRole, client) {
		try {
			if (!newRole.guild.id) return;
		} catch (e) {
			// no
		}

		const config = await getLoggingConfig(client, newRole.guild.id);
		if (!config) return;
		if (!config.enabled) return;

		if (!config.events.includes('roleUpdate')) return;

		const channel = newRole.guild.channels.cache.get(config.channelId);
		if (!channel) return;

		let description = `**Role Edited**\n${newRole}`;
		if (oldRole.mentionable !== newRole.mentionable)
			description += `\n**Mentionable**\n\`${oldRole.mentionable ? 'Yes' : 'No'}\` -> \`${newRole.mentionable ? 'Yes' : 'No'}\``;
		if (oldRole.name !== newRole.name) description += `\n**Name:**\n\`${oldRole.name}\` -> \`${newRole.name}\``;
		if (oldRole.hoist !== newRole.hoist) description += `\n**Seperated in sidebar**\n\`${oldRole.hoist ? 'Yes' : 'No'}\` -> \`${newRole.hoist ? 'Yes' : 'No'}\``;

		if (oldRole.position !== newRole.position) return;
		if (oldRole.rawPosition !== newRole.rawPosition) return;
		if (oldRole.icon !== newRole.icon) return;
		if (oldRole.managed !== newRole.managed) return;

		const embed = new Embed(newRole.hexColor)
			.setDescription(`
                ${description}
                `)
			.setFooter({ text: `@${newRole.name}` });

		const oldPerms = oldRole.permissions.toArray().join('\n');
		const oldPermsLength = String(oldPerms);

		const newPerms = newRole.permissions.toArray().join('\n');
		const newPermsLength = String(newPerms);

		if (oldPermsLength.length < 1024 && newPermsLength.length < 1024 && oldPerms !== newPerms)
			embed.addFields(
				{ name: 'Old Permissions', value: `\`${oldPerms}\``, inline: true },
				{ name: 'New Permissions', value: `\`${newPerms}\``, inline: true }
			);

		await channel.send({
			embeds: [embed]
		});
	}
};