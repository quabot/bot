const colors = require('../../files/colors.json');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
const consola = require('consola');
const { guildUserBanEmbed } = require('../../files/embeds.js');

module.exports = {
    name: "guildBanAdd",
    /**
     * @param {Client} client 
     */
    async execute(paramater1) {

        try {
            const invite = paramater1.guild.id

            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: invite,
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
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        swearEnabled: false,
transcriptChannelID: "none"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                    return;
                }
            });

            const logChannel = paramater1.guild.channels.cache.get(guildDatabase.logChannelID);

            guildUserBanEmbed.setDescription("User banned: " + `${paramater1.user.tag}`)
            guildUserBanEmbed.addField("User-ID", `${paramater1.user.id}`)

            logChannel.send({ embeds: [guildUserBanEmbed] })
        } catch (e) {
            console.log(e);
            return;
        }
    }
};