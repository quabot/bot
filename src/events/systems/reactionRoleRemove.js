const { ReactionManager, User, GuildMember } = require('discord.js');
const { getReactionConfig } = require('../../utils/configs/reactionConfig');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const { CustomEmbed } = require('../../utils/constants/customEmbed');

module.exports = {
    event: 'messageReactionRemove',
    name: 'reactionRoleRemove',
    /**
     *
     * @param {ReactionManager} reaction
     * @param {User} user
     * @param {GuildMember} member
     */
    async execute(reaction, user, client) {
        const Reaction = require('../../structures/schemas/ReactionRole');
        let reactionRole = await Reaction.findOne({
            guildId: reaction.message.guildId,
            messageId: reaction.message.id,
            emoji: reaction._emoji.name
        });
        if (!reactionRole) reactionRole = await Reaction.findOne({
            guildId: reaction.message.guildId,
            messageId: reaction.message.id,
            emoji: `<:${reaction._emoji.name}:${reaction._emoji.id}>`
        })

        if (!reactionRole) return;

        const role = reaction.message.guild.roles.cache.get(`${reactionRole.roleId}`);
        const member = reaction.message.guild.members.cache.get(`${user.id}`);
        if (!role) return;

        if (reactionRole.reqPermission !== 'None' && reactionRole.reqPermission !== 'none') {
            if (!member.permissions.has(reactionRole.reqPermission)) return;
        }

        const config = await getReactionConfig(client, reaction.message.guildId);
        const customConfig = await getServerConfig(client, reaction.message.guildId);
        if (!config || !customConfig) return;
        if (!config.enabled) return;

        let excluded = false;
        reactionRole.excludedRoles.forEach(r => {
            if (interaction.member.roles.cache.some(role => role.id === r)) excluded = true;
        });
        let required = false;
        reactionRole.reqRoles.forEach(r => {
            if (interaction.member.roles.cache.some(role => role.id === r)) required = true;
        });
        if (excluded && !required && reactionRole.reqRoles.length === 0) return;
        
        async function asyncSwitch(type) {
            switch (type) {
                //? Give and remove
                case 'normal':
                    await member.roles.remove(role);

                    const parseNormal = (s) => s.replaceAll('{action}', 'removed').replaceAll('{color}', customConfig.color).replaceAll('{server}', reaction.message.guild.name).replaceAll('{role}', role.name).replaceAll('{user}', user).replaceAll('{message}', reaction.message.url);

                    if (config.dmEnabled) await member.send({
                        embeds: [new CustomEmbed(config.dm, parseNormal)]
                    });

                    break;

                //? Only give it.
                case 'verify':
                    break;

                //? Only remove it when a reaction is added.
                case 'drop':
                    break;

                //? Give and remove, but reversed.
                case 'reversed':
                    await member.roles.add(role);

                    const parseReversed = (s) => s.replaceAll('{action}', 'added').replaceAll('{color}', customConfig.color).replaceAll('{server}', reaction.message.guild.name).replaceAll('{role}', role.name).replaceAll('{user}', user).replaceAll('{message}', reaction.message.url);

                    if (config.dmEnabled) await member.send({
                        embeds: [new CustomEmbed(config.dm, parseReversed)]
                    });

                    break;

                //? Unique mode
                case 'unique':
                    await member.roles.remove(role);

                    const parseUnique = (s) => s.replaceAll('{action}', 'removed').replaceAll('{color}', customConfig.color).replaceAll('{server}', reaction.message.guild.name).replaceAll('{role}', role.name).replaceAll('{user}', user).replaceAll('{message}', reaction.message.url);

                    if (config.dmEnabled) await member.send({
                        embeds: [new CustomEmbed(config.dm, parseUnique)]
                    });
                    break;

                case 'binding':
                    break;
            }
        }

        asyncSwitch(reactionRole.type);
    }
}