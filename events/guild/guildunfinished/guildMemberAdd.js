const { commands } = require('../../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../../files/colors.json');
const consola = require('consola');
const Guild = require('../../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {Client} client 
     */
    async execute(member, client) {

        const settings = await Guild.findOne({
            guildID: member.guild.id
        }, (err, guild) => {
            if (err) return;
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: member.guild.id,
                    guildName: member.guild.name,
                    prefix: config.PREFIX,
                    logChannelID: "none",
                    enableLog: true,
                    enableSwearFilter: false,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: "none",
                    suggestEnabled: true,
                    suggestChannelID: "none",
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                    closedTicketCategoryName: "Closed Tickets",
                    welcomeEnabled: true,
                    welcomeChannelID: "none",
                    enableNSFWContent: false,
                });

                newGuild.save()
                    .catch(err => console.log(err));

                return;
            }
        });
        const logChannel = member.guild.channels.cache.get(settings.logChannelID);
        const joinChannel = member.guild.channels.cache.get(settings.welcomeChannelID);

        console.log(joinChannel)

        if (settings.enableLog === "true") {
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

        if (settings.welcomeEnabled === "true") {
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