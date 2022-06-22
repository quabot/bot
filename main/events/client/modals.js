const { ButtonInteraction, Interaction } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { color } = require('../../structures/settings.json');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (!interaction.isModalSubmit()) return;
        const modal = client.modals.get(interaction.customId);

        if (!modal) return;
        if (modal.permission && !interaction.member.permissions.has(modal.permission))
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`⛔ You do not have permission to use that modal.\nYou need the permission: \`${modal.permission}\` to do that`)
                ], ephemeral: true
            }).catch(err => console.warn(err));

        if (modal.ownerOnly && modal.member.id !== modal.guild.ownerId)
            return modal.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("⛔ Only the owner can use that modal.")
                ], ephemeral: true
            }).catch(err => console.warn(err));

            modal.execute(interaction, client, color);
    }
}