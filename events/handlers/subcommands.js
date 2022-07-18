const { InteractionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

        if (interaction.type === InteractionType.ApplicationCommand) {

            try {
                const command = client.commands.get(interaction.commandName);
                const subcommand = interaction.options.getSubcommand();

                if (!command) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("RED")
                            .setTitle("⛔ An error occured while trying to run this command!")
                    ]
                });

                if (!subcommand) return;

                const subCommand = client.subcommands.get(`${interaction.commandName}/${subcommand}`);

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

                if (subCommand.permission) {
                    if (!interaction.member.permissions.has(subCommand.permission)) {
                        return interaction.reply({ content: `You do not have the required permissions for this (sub)command: \`${interaction.commandName}\`.\nYou need the permission: \`${subCommand.permission}\` to do that`, ephemeral: true }).catch((err => { }));
                    }
                }
    
    
                // * Checks the bot's permissions.
                if (subCommand.permissions) {
                    let error = false;
                    subCommand.permissions.forEach(permission => {
                        if (!interaction.guild.me.permissions.has(permission)) error = true;
                        if (!interaction.guild.me.permissionsIn(interaction.channel).has(permission)) error = true;
                    });
    
                    if (error) {
                        interaction.reply({
                            content:
                                `I need the permission(s): \`${subCommand.permissions.map(i => i)}\` to execute that command. Double check my permissions for the server and/or this channel.`
                            , ephemeral: true
                        }).catch((err => { }));
                        return;
                    }
    
                }

                if (subCommand.command === interaction.commandName && subCommand.name === interaction.options.getSubcommand() && CustomizationDatabase.color) {
                    subCommand.execute(client, interaction, CustomizationDatabase.color);
                }

            } catch (err) {
                return;
            }

        }
    }
}
