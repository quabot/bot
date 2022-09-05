const { Client, GuildMember } = require('discord.js');
const { getRolesConfig } = require('../../structures/functions/config');

module.exports = {
    event: "guildMemberAdd",
    name: "joinRoles",
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client, color) {

        if (!member.guild) return;

        const rolesConfig = await getRolesConfig(client, member.guild.id);
        if (!rolesConfig) return;
        if (rolesConfig.roleEnabled === false) return;
        if (rolesConfig.joinRoles.length === 0) return;

        rolesConfig.joinRoles.forEach(role => {
            if (role.bot && member.user.bot) {
                const fRole = member.guild.roles.cache.get(role.id);
                if (!fRole) return;
                setTimeout(() => {
                    member.roles.add(fRole).catch((err => { }));
                }, role.delay);
            }

            if (role.bot === false && !member.user.bot) {
                const fRole = member.guild.roles.cache.get(role.id);
                if (!fRole) return;
                setTimeout(() => {
                    member.roles.add(fRole).catch((err => { }));
                }, role.delay);
            }
        });
    }
}