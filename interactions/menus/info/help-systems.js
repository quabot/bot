const { MessageEmbed } = require("discord.js");

module.exports = {
    value: "system_commands",
    execute(interaction, client, color) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Other Commands`)
                    .setDescription(`View your XP, leave suggestions, listen to music and so much more, these are the other commands.
                    **/afk** - Set & toggle your afk status.
                    **/level** - View your level, leaderboard & more.
                    **/music** - Listen to music in your voice channel.
                    **/ticket** - Create tickets.
                    **/suggest** - Leave a suggestion.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ], ephemeral: true
        });
    }
}