const { Client, ChannelType, EmbedBuilder } = require("discord.js");
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

        await interaction.deferReply({ ephemeral: true }).catch((err => { }));

        const message_id = interaction.options.getString("message_id");
        const role = interaction.options.getRole("role");
        const emoji = interaction.options.getString("emoji");

        if (!await Reaction.findOne({ guildId: interaction.guild.id, messageId: message_id, emoji: emoji, roleId: role.id })) return interaction.editReply({
            ephemeral: true, embeds: [await generateEmbed(color, "That reaction role doesn't exist.")],
        }).catch((err => { }));


        await Reaction.findOneAndDelete({
            guildId: interaction.guild.id,
            messageId: message_id,
            emoji: emoji,
            roleId: role.id,
        });

        interaction.editReply({
            ephemeral: true, embeds: [await generateEmbed(color, "Successfully deleted the reaction role.")],
        }).catch((err => { }));
    }
}