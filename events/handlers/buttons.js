const { MessageEmbed } = require('discord.js');

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
                        .setDescription(`⛔ You do not have permission to use that button.\nYou need the permission: \`${button.permission}\` to do that`)
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

        button.execute(interaction, client, CustomizationDatabase.color);
    }
}