const colors = require('../../files/colors.json');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
const consola = require('consola');
const { errorMain, addedDatabase } = require('../../files/embeds.js');

module.exports = {
    name: "inviteCreate",
    /**
     * @param {Client} client 
     */
    async execute(invite) {
        try {

            if (invite.guild.id === null) return;

            const Guild = require('../../schemas/GuildSchema');
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
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                    return;
                }
            });
            const logChannel = invite.guild.channels.cache.get(guildDatabase.logChannelID);

            if (logChannel) {
                if (guildDatabase.logEnabled === "false") return;

                const embed = new MessageEmbed()
                    .setTitle("Invite Created!")
                    .addField("Code", `[${invite.code}](https://discord.gg/${invite.code})`)
                    .addField("Expires After", `${invite.maxAge / 60 / 60} hours`)
                    .addField("Channel", `<#${invite.channel.id}>`)
                    .addField("Created By", `<@${invite.inviter.id}>`)
                    .setTimestamp()
                    .setColor(colors.INVITE_CREATE)
                logChannel.send({ embeds: [embed] })
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
};