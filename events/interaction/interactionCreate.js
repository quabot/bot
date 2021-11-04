const { commands } = require('../../index');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            consola.info(`/${command.name} was used.`)
            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(colors.RED)
                        .setTitle("⛔ An error occured while trying to run this command!")
                ]
            }) && client.commands.delete(interaction.commandName);

            command.execute(client, interaction);
            
            //     const embed = new MessageEmbed()
            //     .setTitle("Database issues")
            //     .setColor(colors.COLOR)
            //     .setDescription("Our database is too slow at the moment to function correctly, so we've taken down our bot temporarily.\n**What does this mean?**\nYou won't gain level XP, and no events will be logged. No commands will function and just overall lag.")
            // interaction.reply({ embeds: [embed]});
        }
    }
}