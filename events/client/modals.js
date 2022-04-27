const { ButtonInteraction } = require('discord.js');
const { color } = require('../../structures/settings.json');

module.exports = {
    name: "modalSubmit",
    async execute(modal, client) {
        const modalC = client.modals.get(modal.customId);

        if (!modalC) return;
        if (modalC.permission && !interaction.member.permissions.has(modalC.permission))
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("⛔ You do not have permission to use that modal.")
                ], ephemeral: true
            }).catch(err => console.warn(err));

        if (modalC.ownerOnly && interaction.member.id !== interaction.guild.ownerId)
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("⛔ Only the owner can use that modal.")
                ], ephemeral: true
            }).catch(err => console.warn(err));

            modalC.execute(modal, client, color);
    }
}