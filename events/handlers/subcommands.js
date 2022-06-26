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

                if (subCommand.command === interaction.commandName && subCommand.name === interaction.options.getSubcommand()) {
                    subCommand.execute(client, interaction);
                }
                
            } catch (err) {
                return;
            }

        }
    }
}