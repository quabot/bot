const { MessageEmbed } = require("discord.js");

module.exports = {
    value: "misc_commands",
    execute(interaction, client, color) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Misc Commands`)
                    .setDescription(`See the servericon or avatar, these are the misc commands.
                    **/avatar** - See a users' avatar.
                    **/members** - Get the membercount.
                    **/servericon** - Get the servericon.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ]
        });
    }
}