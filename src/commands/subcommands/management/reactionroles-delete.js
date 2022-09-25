const { Client, ChannelType, EmbedBuilder, Message } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");
const Reaction = require('../../../structures/schemas/ReactionRoleSchema');

module.exports = {
    name: "delete",
    command: "reactionroles",
    /**
     * @param {Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: true }).catch((e => { }));

        const message_id = interaction.options.getString("message_id");
        const channel = interaction.options.getChannel("channel");
        const emoji = interaction.options.getString("emoji");

        if (!await Reaction.findOne({ guildId: interaction.guild.id, messageId: message_id, emoji: emoji, channelId: channel.id })) return interaction.editReply({
            embeds: [await generateEmbed(color, "That reaction role doesn't exist.")],
        }).catch((e => { }));


        await Reaction.findOneAndDelete({
            guildId: interaction.guild.id,
            messageId: message_id,
            emoji: emoji,
            channelId: channel.id,
        });

        const message = await channel.messages.fetch({ message: message_id })
            .catch(async e => {
                await interaction.editReply({
                    ephemeral: true, embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setDescription("Could not find that message.")
                    ]
                }).catch((e => { }));
                return;
            });

        message.reactions.resolve(emoji).users.remove(client.user.id).catch((e => { }));

        interaction.editReply({
            ephemeral: true, embeds: [await generateEmbed(color, "Successfully deleted the reaction role.")],
        }).catch((e => { }));
    }
}