const { commands } = require('../..');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');
const { errorMain, addedDatabase } = require('../../files/embeds.js');

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {Client} client 
     */
    async execute(member, client) {
        if (member.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: member.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: member.guild.id,
                        guildName: member.guild.name,
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
                        levelEnabled: false,
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
            const logChannel = member.guild.channels.cache.get(guildDatabase.logChannelID);
            const joinChannel = member.guild.channels.cache.get(guildDatabase.welcomeChannelID);

            if (guildDatabase.roleEnabled === "true") {
                let mainRoleName = guildDatabase.mainRole;
                let mainRole = member.guild.roles.cache.find(role => role.name === `${mainRoleName}`);
                let memberTarget = member.guild.members.cache.get(member.id);

                if (mainRole) {
                    memberTarget.roles.add(mainRole.id);
                }
            }

            let joinmessage = guildDatabase.joinMessage;

            if (joinmessage === undefined) joinmessage = "Welcome {user} to **{guild-name}**!"

            joinmessage = joinmessage.replace("{user}", member);
            joinmessage = joinmessage.replace("{user-name}", member.user.username);
            joinmessage = joinmessage.replace("{user-discriminator}", member.user.discriminator);
            joinmessage = joinmessage.replace("{guild-name}", member.guild.name);

            console.log(joinmessage)

            if (guildDatabase.logEnabled === "true") {
                if (logChannel) {
                    const embed = new MessageEmbed()
                        .setColor(colors.JOIN_COLOR)
                        .setTitle('Member joined!')
                        .setAuthor(`${member.user.tag} just joined!`, member.user.avatarURL())
                        .addField('User', `${member.user}`)
                        .addField('User-ID', `${member.user.id}`)
                    logChannel.send({ embeds: [embed] });
                };
            }

            if (guildDatabase.welcomeEnabled === "true") {
                if (joinChannel) {
                    const welcomeEmbed = new MessageEmbed()
                        .setAuthor(`${member.user.tag} just joined!`, member.user.avatarURL())
                        .setDescription(`${joinmessage}`)
                        .setColor(colors.JOIN_COLOR);
                    joinChannel.send({ embeds: [welcomeEmbed] });
                }
            }
        } catch (e) {
            console.log(e)
            return;
        }
    }
}