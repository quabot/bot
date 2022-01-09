const discord = require("discord.js");

const colors = require('../../files/colors.json');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "announcement",
    description: "Latest quabot news.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            const embed = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle("2.0.1 Changelogs")
                .addField("Changes", "- Added Invite, Discord and Website links to `/help` and `/config`\n- Updated the Error message\n- Updated URL's for QuaBeta\n- Added the abilities to lock and unlock voice channels with `/lock`")
                .addField("New", "- Added `/discriminator` to get all users with a specific discriminator.\n- Added `/role create [name] (color)`, used to create a role, you can specify the name and color.\n- Added `/role delete [name] `, used to delete a role.\n- Added `/role add [user] [role-name]`, used to give someone a role, has a user and role-name argument\n- Added `/role remove [user] [role-name]`, used to remove a role from someone , has a user and role-name argument\n- Added `/color [hex-color]`, used to visualize a color, has a hex-color argument\n- Added `/afk toggle`, used to enable or disable afk mode, where users are alerted that you're afk when mentioned.\n- Added `/afk status [status]`, used to set a message for the people mentioning you.\n- Added `/afk reset`, used to reset your afk message and disable your afk mode.")
                .addField("Fixes", "- Fixed incorrect wording on /punishments (mute has been replaced with timeout and warn section has been rewritten)\n- Fixed a crash when message content on deletion was too long\n- Fixed a crash when message content on message editing was too long\n- Fixed a crash when role permissions on role create were too long\n- Fixed another crash related to message deletion")
                .setFooter('2.0.1', 'https://i.imgur.com/5fjO46O.png')
                .setTimestamp()
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}