const { ButtonInteraction } = require('discord.js');
const { color } = require('../../structures/settings.json');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        const button = client.buttons.get(interaction.customId);

        if (!button) return;
        if (button.permission && !interaction.member.permissions.has(button.permission))
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("⛔ You do not have permission to use that button.")
                ], ephemeral: true
            }).catch(err => console.warn(err));

        if (button.ownerOnly && interaction.member.id !== interaction.guild.ownerId)
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("⛔ Only the owner can use that button.")
                ], ephemeral: true
            }).catch(err => console.warn(err));

        button.execute(interaction, client, color);
    }
}