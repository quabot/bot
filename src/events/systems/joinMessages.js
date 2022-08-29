const { Client, GuildMember } = require('discord.js');

module.exports = {
    event: "guildMemberAdd",
    name: "joinMessages",
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client, color) {

       //console.log(member)
        console.log("JOiN Message")

        // fetch the database
        // get the member
        // get the channel
        // return if none
        
        // check if verify is enabled (and valid)
        // check if verify wait mode is on
        // return if it is

        // get embed/message (return it as the { } component in interaction.reply)
        // send the message (try to)
    }
}