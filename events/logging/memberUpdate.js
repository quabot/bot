const colors = require('../../files/colors.json');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
const consola = require('consola'); // for logging
const { errorMain, addedDatabase } = require('../../files/embeds.js');

module.exports = {
    name: "guildMemberUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldMember, newMember) {

        try {
            //console.log(newMember)
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: oldMember.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: oldMember.guild.id,
                        guildName: oldMember.guild.name,
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
            const logChannel = oldMember.guild.channels.cache.get(guildDatabase.logChannelID);

            if (oldMember.nickname !== newMember.nickname) {
                let oldNick = oldMember.nickname;
                let newNick = newMember.nickname;
                if (oldNick === null) oldNick = "none";
                if (newNick === null) newNick = "none";

                const embedNickChange = new MessageEmbed()
                    .setTitle("Nickname changed")
                    .addField("Old Nickname", `${oldNick}`)
                    .addField("New Nickname", `${newNick}`)
                    .addField("User", `${newMember}`)
                    .setTimestamp()
                    .setFooter(`User-ID: ${newMember.user.id}`)
                    .setColor(colors.COLOR)
                logChannel.send({ embeds: [embedNickChange] });
                return;
            }
            if (oldMember._roles !== newMember._roles) {
                if (oldMember._roles > newMember._roles) {
                    const roleRemoved = new MessageEmbed()
                        .setTitle('Role(s) Removed')
                        .addField("User", `${newMember}`)
                        .setDescription(`<@&${oldMember._roles.filter(n => !newMember._roles.includes(n)).join('>\n<@&')}>`)
                        .setColor(colors.COLOR)
                        .setFooter(`User ID: ${newMember.id}`)
                        .setTimestamp();
                    logChannel.send({ embeds: [roleRemoved]}); 
                }
                if (oldMember._roles < newMember._roles) {
                    const roleRemoved = new MessageEmbed()
                        .setTitle('Role(s) Added')
                        .addField("User", `${newMember}`)
                        .setDescription(`<@&${newMember._roles.filter(n => !oldMember._roles.includes(n)).join('>\n<@&')}>`)
                        .setColor(colors.COLOR)
                        .setFooter(`User ID: ${newMember.id}`)
                        .setTimestamp();
                    logChannel.send({ embeds: [roleRemoved]}); 
                }
            }
        } catch (e) {
            //console.log(e)
            return;
        }


    }
};