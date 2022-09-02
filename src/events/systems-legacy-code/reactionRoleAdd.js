const { ReactionManager, User, GuildMember } = require('discord.js');

module.exports = {
    event: "messageReactionAdd",
    name: "reactionRoleAdd",
    /**
     * 
     * @param {ReactionManager} reaction 
     * @param {User} user 
     * @param {GuildMember} member
     */
    async execute(reaction, user, client) {

        const ReactionRoleSchema = require('../../structures/schemas/ReactionRoleSchema');
        const reactionRole = await ReactionRoleSchema.findOne({
            guildId: reaction.message.guildId,
            messageId: reaction.message.id,
            emoji: reaction._emoji.name
        }, (err) => {
            if (err) console.log(err);
        }).clone().catch((err => { }));
        
        if (!reactionRole) return;


        const role = reaction.message.guild.roles.cache.get(`${reactionRole.roleId}`);
        const member = reaction.message.guild.members.cache.get(`${user.id}`);
        if (!role) return;

        //! fix the permissions system
        if (reactionRole.reqPermission !== "None") {
            if (!member.permissions.has(reactionRole.reqPermission)) return;
        }

        async function asyncSwitch(type) {
            switch (type) {

                //? Give and remove
                case "normal":
                    member.roles.add(role).catch((err => { }));
                    break;

                //? Only give it.
                case "verify":
                    member.roles.add(role).catch((err => { }));
                    break;

                //? Only remove it when a reaction is added.
                case "drop":
                    member.roles.remove(role).catch((err => { }));
                    break;

                //? Give and removed, but reversed.
                case "reversed":
                    member.roles.remove(role).catch((err => { }));
                    break;

                //? Unique (only pick one role from the message at a time)
                case "unique":

                    const reactions = await ReactionRoleSchema.find({
                        guildId: reaction.message.guildId,
                        messageId: reaction.message.id,
                        mode: "unique"
                    });
                    if (!reactions) return;


                    let hasRole = false;

                    reactions.forEach(item => {
                        const role = reaction.message.guild.roles.cache.get(item.roleId);
                        const member = reaction.message.guild.members.cache.get(user.id);
                        if (!role) return;
                        if (member.roles.cache.some(role => role.id === `${item.roleId}`)) hasRole = true;
                    });

                    if (hasRole) return;
                    if (!hasRole) member.roles.add(role).catch(() => null);

                    break;

                case "binding":
                    const reactionsFound = await ReactionRoleSchema.find({
                        guildId: reaction.message.guildId,
                        messageId: reaction.message.id,
                        mode: "unique"
                    });
                    if (!reactionsFound) return;


                    let hasRoleBool = false;

                    reactionsFound.forEach(item => {
                        const role = reaction.message.guild.roles.cache.get(item.roleId);
                        const member = reaction.message.guild.members.cache.get(user.id);
                        if (!role) return;
                        if (member.roles.cache.some(role => role.id === `${item.roleId}`)) hasRoleBool = true;
                    });

                    if (hasRoleBool) return;
                    if (!hasRoleBool) member.roles.add(role).catch(() => null);
                    break;


            }
        }

        asyncSwitch(reactionRole.type);

    }
}
