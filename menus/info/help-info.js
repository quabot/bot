const { MessageEmbed } = require("discord.js");

module.exports = {
    value: "info_commands",
    execute(interaction, client, color) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Info Commands`)
                    .setDescription(`Bot status, ping, info about a user, these are the info commands.
                    **/help** - Bot commands.
                    **/info** - Bot info.
                    **/ping** - Bot ping.
                    **/roles** - Server\'s roles.
                    **/serverinfo** - Server\'s info.
                    **/status** - Bot status.
                    **/userinfo** - Info about a user.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ]
        });
    }
}