const { MessageEmbed } = require("discord.js");

module.exports = {
    value: "management_commands",
    execute(interaction, client, color) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Management Commands`)
                    .setDescription(`View your XP, leave suggestions, listen to music and so much more, these are the other commands.
                    **/afk** - Set & toggle your afk status.
                    **/level** - View your level, leaderboard & more.
                    **/music** - Listen to music in your voice channel.
                    **/suggest** - Leave a suggestion.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ], ephemeral: true
        });
    }
}