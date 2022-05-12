const { MessageEmbed } = require("discord.js");

module.exports = {
    value: "system_commands",
    execute(interaction, client, color) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Other Commands`)
                    .setDescription(`See the servericon or avatar, these are the misc commands.
                    **/avatar** - See a users' avatar.
                    **/members** - Get the membercount.
                    **/random** - Roll a random number between two integers.
                    **/servericon** - Get the servericon.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ], ephemeral: true
        });
    }
}