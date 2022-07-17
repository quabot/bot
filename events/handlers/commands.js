const { EmbedBuilder, InteractionType } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

        if (interaction.type === InteractionType.ApplicationCommand) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("RED")
                        .setTitle("⛔ An error occured while trying to run this command!")
                ]
            }).catch((err => { })) && client.commands.delete(interaction.commandName);

            if (command.permission) {
                if (!interaction.member.permissions.has(command.permission)) {
                    return interaction.reply({ content: `You do not have the required permissions for this command: \`${interaction.commandName}\`.\nYou need the permission: \`${command.permission}\` to do that`, ephemeral: true }).catch((err => { }));
                }
            }


            // * Checks the bot's permissions.
            if (command.permissions) {
                let error = false;
                command.permissions.forEach(permission => {
                    if (!interaction.guild.me.permissions.has(permission)) error = true;
                    if (!interaction.guild.me.permissionsIn(interaction.channel).has(permission)) error = true;
                });

                if (error) {
                    interaction.reply({
                        content:
                            `I need the permission(s): \`${command.permissions.map(i => i)}\` to execute that command. Double check my permissions for the server and/or this channel.`
                        , ephemeral: true
                    }).catch((err => { }));
                    return;
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
            }).clone().catch((err => { }));

            if (!CustomizationDatabase) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("RED")
                        .setDescription("Unable to get this server's customization settings. Please try again.")
                ], ephemeral: true
            }).catch((err => { }));

            command.execute(client, interaction, CustomizationDatabase.color) // catch errors
            if (!command.name) return;

            // log commands being used

        }
    }
}
