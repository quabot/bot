const { EmbedBuilder, Message } = require('discord.js');

module.exports = {
    name: "messageDelete",
    async execute(message, client, color) {

        const Reaction = require('../../structures/schemas/ReactionRoleSchema');
        const found = await Reaction.find({
            guildId: message.guild.id,
            messageId: message.id,
        });

        if (found) {
            found.forEach(async item => {
                await Reaction.findOneAndDelete({
                    guildId: message.guild.id,
                    messageId: message.id,
                    roleId: item.roleId,
                    emoji: item.emoji
                });
            })
        }

    }
}
