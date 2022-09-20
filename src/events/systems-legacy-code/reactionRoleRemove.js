const { EmbedBuilder, Interaction } = require('discord.js');

module.exports = {
    event: "messageReactionRemove",
    name: "reactionRoleRemove",
    async execute(reaction, user, client) {

        const ReactionRoleSchema = require('../../structures/schemas/ReactionRoleSchema');
        const reactionRole = await ReactionRoleSchema.findOne({
            guildId: reaction.message.guildId,
            messageId: reaction.message.id,
            emoji: reaction._emoji.name
        }, (err) => {
            if (err) console.log(err);
        }).clone().catch((e => { }));

        if (!reactionRole) return;

        const role = reaction.message.guild.roles.cache.get(`${reactionRole.roleId}`);
        const member = reaction.message.guild.members.cache.get(`${user.id}`);
        if (!role) return;

        if (reactionRole.reqPermission !== "None" && reactionRole.reqPermission !== "none") {
            if (!member.permissions.has(reactionRole.reqPermission)) return;
        }

        switch (reactionRole.type) {

            //? Give and remove.
            case "normal":
                member.roles.remove(role).catch((e => { }));
                break;


            //? Only give it.
            case "verify":
                break;

            //? Only remove it when a reaction is added.
            case "drop":
                break;

            //? Give and removed, but reversed.
            case "reversed":
                member.roles.add(role).catch((e => { }));
                break;

            //? Unique mode.
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

                if (hasRole) member.roles.remove(role).catch((e => { }));

                break;


        }

    }
}
