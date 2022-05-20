const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "messageReactionRemove",
    async execute(messageReaction, user, client, color) {
        try {

            const Reaction = require('../../structures/schemas/ReactionSchema');
            const reactionFound = await Reaction.findOne({
                guildId: messageReaction.message.guild.id,
                messageId: messageReaction.message.id,
                emoji: messageReaction._emoji.name,
            });

            if (!reactionFound) return;
            
            let mode = reactionFound.reactMode;
            let member = messageReaction.message.guild.members.cache.get(user.id);

            switch (mode) {
                case "Normal":
                    member.roles.remove(reactionFound.role).catch((err => { }));
                    break;
            }

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}