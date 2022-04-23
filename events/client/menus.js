const { ButtonInteraction } = require('discord.js');
const { color } = require('../../structures/settings.json');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (!interaction.isSelectMenu()) return;
        const menu = client.menus.get(interaction.values[0]);

        if (!menu) return;
        if (menu.permission && !interaction.member.permissions.has(menu.permission))
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("⛔ You do not have permission to use that menu.")
                ], ephemeral: true
            }).catch(err => console.warn(err));

        if (menu.ownerOnly && interaction.member.id !== interaction.guild.ownerId)
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("⛔ Only the owner can use that menu.")
                ], ephemeral: true
            }).catch(err => console.warn(err));

        menu.execute(interaction, client, color);
    }
}