const { Client, GuildMember } = require('discord.js');

module.exports = {
    event: "guildMemberAdd",
    name: "joinRoles",
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client, color) {

        //console.log(member)

        // fetch the database
        // get the member
        
        // get the roles

        //if bot, give bot role (w delay), otherwise give human role.
    }
}