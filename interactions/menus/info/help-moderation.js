const { MessageEmbed } = require("discord.js");

module.exports = {
    value: "moderation_commands",
    execute(interaction, client, color) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Moderation Commands`)
                    .setDescription(`Ban users, warn them and so much more, these are the moderation commands.
                    **/ban** - Ban a user.
                    **/clear-punishment** - Clear a punsihment of a user.
                    **/find-punishment** - Find a punsihment of a user.
                    **/kick** - Kick a user.
                    **/tempban** - Tempban a user.
                    **/timeout** - Timeout a user.
                    **/unban** - Unban a user.
                    **/untimeout** - Un-timeout a user.
                    **/warn** - Warn a user.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ], ephemeral: true
        });
    }
}