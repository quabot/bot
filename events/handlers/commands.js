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
            }) && client.commands.delete(interaction.commandName);

            if (command.permission) {
                if (!interaction.member.permissions.has(command.permission)) {
                    return interaction.reply({ content: `You do not have the required permissions for this command: \`${interaction.commandName}\`.\nYou need the permission: \`${command.permission}\` to do that`, ephemeral: true })
                }
            }

            command.execute(client, interaction);
            if (!command.name) return;

        }
    }
}