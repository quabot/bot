const { Client, GuildMember } = require('discord.js');

module.exports = {
    event: "guildMemberRemove",
    name: "leaveMessages",
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client, color) {

       // console.log(member)

        // fetch the database
        // get the member
        // get the channel
        // return if none

        // get embed/message (return it as the { } component in interaction.reply)
        // send the message (try to)
    }
}