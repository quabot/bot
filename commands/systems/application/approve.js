const { MessageEmbed, MessageActionRow, MessageButton, PermissionOverwrites, Permissions, Message, MessageManager, DiscordAPIError } = require('discord.js');

module.exports = {
    name: "approve",
    command: "application",
    async execute(client, interaction, color) {

        // Find the applications
        const Application = require('../../../structures/schemas/ApplicationSchema');
        const ApplicationDatabase = await Application.find({
            guildId: interaction.guild.id
        }, (err, application) => {
            if (err) console.log(err);
            if (!application) {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Could not find that application. Please create one on our [dashboard](https://dashboard.quabot.net)`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));
            }
        }).clone().catch((err => { }));

        if (!ApplicationDatabase) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Could not find that application. Please create one on our [dashboard](https://dashboard.quabot.net)`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));
        }

        
    }
}