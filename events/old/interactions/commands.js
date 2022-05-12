module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        const { MessageEmbed } = require('discord.js')
        if (!interaction.isCommand()) {
            consola.info(`${interaction.customId} was used`);
            client.guilds.cache.get('847828281860423690').channels.cache.get('948193100604526622').send({ embeds: [new MessageEmbed().setDescription(`**${interaction.user.username}#${interaction.user.discriminator}** used **${interaction.customId}** in **${interaction.guild.name}**`)] }).catch(( err => { } ));
        }
        if (interaction.isCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(colors.RED)
                        
                        .setTitle("⛔ An error occured while trying to run this command!")
                ]
            }) && client.commands.delete(interaction.commandName);

            command.execute(client, interaction);
            consola.info(`/${command.name} was used`);
            client.guilds.cache.get('847828281860423690').channels.cache.get('948192914603933716').send({ embeds: [new MessageEmbed().setDescription(`**${interaction.user.username}#${interaction.user.discriminator}** used **${command.name}** in **${interaction.guild.name}**`)] }).catch(( err => { } ))
        }
    }
}