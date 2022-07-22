const { EmbedBuilder, Message } = require('discord.js');

module.exports = {
    name: "roleDelete",
    async execute(role, client, color) {

        const Reaction = require('../../structures/schemas/ReactionRoleSchema');
        const found = await Reaction.find({
            guildId: role.guild.id,
            roleId: role.id,
        });

        if (found) {
            found.forEach(async item => {
                await Reaction.findOneAndDelete({
                    guildId: item.guildId,
                    messageId: item.messageId,
                    roleId: role.id,
                    emoji: item.emoji
                });
            })
        }

    }
}
