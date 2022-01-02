const colors = require('../../files/colors.json');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
const consola = require('consola'); // for logging
const { guildUserBanEmbed } = require('../../files/embeds.js');

module.exports = {
    name: "guildBanAdd",
    /**
     * @param {Client} client 
     */
    async execute(paramater1, paramater2) {

        const invite = paramater1[0]

        const Guild = require('../../schemas/GuildSchema');
        // make sure to change the invite to the proper paramter (message.guild.id, member.guild.id)
        const guildDatabase = await Guild.findOne({
            guildId: invite.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: invite.guild.id,
                    guildName: invite.guild.name,
                    logChannelID: "none",
                    reportChannelID: "none",
                    suggestChannelID: "none",
                    welcomeChannelID: "none",
                    levelChannelID: "none",
                    pollChannelID: "none",
                    ticketCategory: "Tickets",
                    closedTicketCategory: "Closed Tickets",
                    logEnabled: true,
                    musicEnabled: true,
                    levelEnabled: true,
                    reportEnabled: true,
                    suggestEnabled: true,
                    ticketEnabled: true,
                    welcomeEnabled: true,
                    pollsEnabled: true,
                    roleEnabled: true,
                    mainRole: "Member",
                    mutedRole: "Muted"
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                    });
                return;
            }
        });
        // change the invite.guild to work
        const logChannel = invite.guild.channels.cache.get(guildDatabase.logChannelID);

        // colors = colors.COLOR for the main color, colors.MESSAGE_UPDATE for blue, colors.RED for red and colors.LIME for lime.
        
        guildUserBanEmbed.setDescription("User banned: " + paramater1[0].user.tag)

        logChannel.send({ embeds: [guildUserBanEmbed] })
    }
};