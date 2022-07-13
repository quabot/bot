const { MessageEmbed } = require('discord.js');

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
        const Customization = require('../../structures/schemas/CustomizationSchema');
        const CustomizationDatabase = await Customization.findOne({
            guildId: interaction.guild.id,
        }, (err, customization) => {
            if (err) console.log(err);
            if (!customization) {
                const newCustomization = new Customization({
                    guildId: interaction.guild.id,
                    color: "#3a5a74"
                });
                newCustomization.save();
            }
        }).clone().catch((err => { }));

        if (!CustomizationDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("Unable to get this server's customization settings. Please try again.")
            ], ephemeral: true
        }).catch((err => { }));

        modal.execute(interaction, client, CustomizationDatabase.color);
    }
}