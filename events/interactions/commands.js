
module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (!interaction.isCommand()) consola.info(`${interaction.customId} was used`);
        if (interaction.isCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(colors.RED)
                        .setTimestamp()
                        .setTitle("⛔ An error occured while trying to run this command!")
                ]
            }) && client.commands.delete(interaction.commandName);

            command.execute(client, interaction);
            consola.info(`/${command.name} was used`);
        }
    }
}