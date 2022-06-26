const { MessageEmbed} = require('discord.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

        if (interaction.isCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setTitle("⛔ An error occured while trying to run this command!")
                ]
            }).catch(( err => { })) && client.commands.delete(interaction.commandName);

            if (command.permission) {
                if (!interaction.member.permissions.has(command.permission)) {
                    return interaction.reply({ content: `You do not have the required permissions for this command: \`${interaction.commandName}\`.\nYou need the permission: \`${command.permission}\` to do that`, ephemeral: true })
                }
            }

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
            }).clone().catch(( err => { }));

            if (!CustomizationDatabase) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("Unable to get this server's customization settings. Please try again.")
                ], ephemeral: true
            }).catch(( err => { }));

            command.execute(client, interaction, CustomizationDatabase.color);
            if (!command.name) return;

            // log commands being used

        }
    }
}