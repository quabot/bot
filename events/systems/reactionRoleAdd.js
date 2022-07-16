const { MessageEmbed, Interaction } = require('discord.js');
const { getColor } = require('../../structures/files/contants');

module.exports = {
    name: "messageReactionAdd",
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

                    let reactedCount = 0;
                    let itemsProcessed = 0;

                    const getUnique = new Promise((resolve, recject) => {
                        reactions.forEach(async item => {
                            itemsProcessed++;

                            const foundReaction = reaction.message.reactions.cache.get(`${item.emoji}`);

                            if (!foundReaction) return;
                            const foundUsers = await foundReaction.users.fetch()

                            if (!foundUsers) return;

                            const uFound = foundUsers.find(u => u.id === user.id);
                            if (uFound) reactedCount++;

                            if (reactions.length === itemsProcessed) setTimeout(() => resolve(), 3000);
                            
                        });
                    })

                    getUnique.then(() => {
                        if (reactedCount >= 2) return;
                        if (reactedCount === 1) member.roles.add(role).catch((err => { }))
                    });

                    break;

            }
        }

        asyncSwitch(reactionRole.type);

    }
}
