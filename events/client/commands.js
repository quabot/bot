const consola = require('consola');
const { color } = require('../../structures/settings.json');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        const { MessageEmbed } = require('discord.js');
        if (!interaction.isCommand()) {
            if (interaction.isSelectMenu()) {
                consola.info(`${interaction.values[0]} was selected`);
            }
            client.guilds.cache.get('957024489638621185').channels.cache.get('957024582794104862').send({ embeds: [new MessageEmbed().setDescription(`**${interaction.user.username}#${interaction.user.discriminator}** used **${interaction.customId}** in **${interaction.guild.name}**`)] }).catch(err => console.log(err));;
        }
        if (interaction.isCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setTitle("⛔ An error occured while trying to run this command!")
                ]
            }) && client.commands.delete(interaction.commandName);

            command.execute(client, interaction, color);
            consola.info(`/${command.name} was used`);
            client.guilds.cache.get('957024489638621185').channels.cache.get('957024490318094369').send({ embeds: [new MessageEmbed().setDescription(`**${interaction.user.username}#${interaction.user.discriminator}** used **${command.name}** in **${interaction.guild.name}**`)] }).catch(err => console.log(err));
        }
    }
}