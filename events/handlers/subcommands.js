module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

        if (interaction.isCommand()) {

            try {

                const command = client.commands.get(interaction.commandName);
                const subcommand = interaction.options.getSubcommand();

                if (!command) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
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
                        new MessageEmbed()
                            .setColor("RED")
                            .setDescription("Unable to get this server's customization settings. Please try again.")
                    ], ephemeral: true
                }).catch((err => { }));

                command.execute(client, interaction, CustomizationDatabase.color);

                if (subCommand.command === interaction.commandName && subCommand.name === interaction.options.getSubcommand() && CustomizationDatabase.color) {
                    subCommand.execute(client, interaction, CustomizationDatabase.color);
                }

            } catch (err) {
                return;
            }

        }
    }
}