const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {Client} client 
     */
    async execute(member, client) {

        const Guild = require('../../schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: message.guild.id,
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
                    levelEnabled: true,
                    reportEnabled: true,
                    suggestEnabled: true,
                    ticketEnabled: true,
                    welcomeEnabled: true,
                    pollsEnabled: true,
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
        const logChannel = member.guild.channels.cache.get(guildDatabase.logChannelID);
        const joinChannel = member.guild.channels.cache.get(guildDatabase.welcomeChannelID);

        console.log(joinChannel)

        if (guildDatabase.logEnabled === "true") {
            if (logChannel) {
                const embed = new MessageEmbed()
                    .setColor(colors.LIME)
                    .setTitle('Member joined!')
                    .setAuthor(`${member.user.tag} just joined!`, member.user.avatarURL())
                    .addField('User', `${member.user}`)
                    .addField('User-ID', `${member.user.id}`)
                logChannel.send({ embeds: [embed] });
            };
        }

        if (guildDatabase.welcomeEnabled === "true") {
            if(joinChannel) {
                const welcomeEmbed = new MessageEmbed()
                .setAuthor(`${member.user.tag} just joined!`, member.user.avatarURL())
                .setDescription(`Welcome ${member.user} to **${member.guild.name}**!`)
                .setColor(colors.LIME);
            joinChannel.send({ embeds: [welcomeEmbed] });
            }
        }
    }
}