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
                .setTitle("2.0.2 Changelogs")
                .addField("Changes", "- Updated join and leave colors\n- Removed the category option on /help\n- Updated entire backend, allowing for even cooler features!")
                .addField("New", "- Added `/reddit [subreddit]` to get images from any subreddit. (The messages are private, we tried to block out most NSFW subreddits, but not all were blocked of course, so the messages are private for now)\n- Added `/admin`, used to create a static ticket message where users can always create a ticket.\n- Added a dropdown for events toggles, unavailable atm.\n- Added logging for Guild Member Ban add.\n- Added logging for roles updates\n- Added boosts logging (boost messages next update)\n- Added `/channel create [name] (description) (slowmode)`, to create a channel.\n- Added `/channel delete [channel]`, to delete a channel.\n- Added `/channel slowmode [channel] [slowmode]`, to create a channel.\n- Added economy commands [locked for the public]")
                .addField("Fixes", "- Fixed ping being buggy on `/ping`")
                .setFooter('2.0.2', 'https://i.imgur.com/5fjO46O.png')
                .setTimestamp()
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}