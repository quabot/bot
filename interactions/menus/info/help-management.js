const { MessageEmbed } = require("discord.js");

module.exports = {
    value: "management_commands",
    execute(interaction, client, color) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Management Commands`)
                    .setDescription(`Configure QuaBot, lock a server down, these are the management commands.
                    **/clear** - Clear an amount of messages.
                    **/config-level** - Configure the levels module.
                    **/config** - Dashboard Link.
                    **/dashboard** - Get the dashboard URL.
                    **/poll** - Manage polls.
                    **/reactionroles** - Mangage the reaction roles.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ], ephemeral: true
        });
    }
}