const colors = require('../../files/colors.json');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
const consola = require('consola');
const { errorMain, addedDatabase } = require('../../files/embeds.js');
module.exports = {
    name: "messageUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldMessage, newMessage) {
        if (oldMessage.guild.id === null) return;
        
        if (newMessage.author.bot) return;

        const Guild = require('../../schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: newMessage.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: newMessage.guild.id,
                    guildName: newMessage.guild.name,
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
        const logChannel = newMessage.guild.channels.cache.get(guildDatabase.logChannelID);

        if (guildDatabase.logEnabled === "false") return;

        const embed = new MessageEmbed()
            .setTitle("Message Updated!")
            .setTimestamp()
            .setFooter(`Message-ID: ${oldMessage.id}`)
            .setColor(colors.MESSAGE_UPDATED);

        if (oldMessage.content !== newMessage.content) {
            embed.addField("Content", `${oldMessage.content} ** **`)
            embed.addField("Changed to", `${newMessage.content} ** **`)
        }
        embed.addField("Channel", `${oldMessage.channel} ** **`)
        if (oldMessage.author === null || oldMessage.author === '') { } else {
            embed.addField("User", `${oldMessage.author} ** **`)
        }
        if (oldMessage.attachments !== null) {
            oldMessage.attachments.map(getUrls);
            function getUrls(item) {
                embed.addField(`**Attachments:**`, `${[item.url].join(" ")}`)
            }
        }

        logChannel.send({ embeds: [embed] });
    }
};