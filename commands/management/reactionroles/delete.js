
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message } = require('discord.js');

module.exports = {
    name: "delete",
    command: "reactionroles",
    async execute(client, interaction, color) {

        const message_id = interaction.options.getString("message_id");
        const role = interaction.options.getRole("role");
        const emoji = interaction.options.getString("emoji");

        await interaction.deferReply({ ephemeral: true });

        const Reaction = require('../../../structures/schemas/ReactionRoleSchema');
        const found = await Reaction.findOne({
            guildId: interaction.guild.id,
            messageId: message_id,
            emoji: emoji,
            roleId: role.id,
        });

        if (!found) return interaction.followUp({
            ephemeral: true, embeds: [
                new EmbedBuilder()
                    .setDescription(`That reactionrole doesn't exist!`)
                    .setColor(color)
            ]
        }).catch((err => { }));

        await Reaction.findOneAndDelete({
            guildId: interaction.guild.id,
            messageId: message_id,
            emoji: emoji,
            roleId: role.id,
        });

        if (found) return interaction.followUp({
            ephemeral: true, embeds: [
                new EmbedBuilder()
                    .setDescription("Deleted the reactionrole.")
                    .setColor(color)
            ]
        }).catch((err => { }));

    }
}
