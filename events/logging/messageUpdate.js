const colors = require('../../files/colors.json');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
const consola = require('consola');
const { errorMain, addedDatabase } = require('../../files/embeds.js');
const { default: consolaGlobalInstance } = require('consola');
module.exports = {
    name: "messageUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldMessage, newMessage) {
        try {
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
            const logChannel = newMessage.guild.channels.cache.get(guildDatabase.logChannelID);

            const { Swears } = require('../../validation/swearwords');
            let msg = newMessage.content.toLowerCase();
            msg = msg.replace(/\s+/g, '');
            msg = msg.replace('.', '');
            msg = msg.replace(',', '');
            for (let i = 0; i < Swears.length; i++) {
                if (msg.includes(Swears[i])) {
                    const SwearFound = new MessageEmbed()
                        .setDescription(`Please do not swear! One of your servers, **${newMessage.guild.name}** has a swearfilter activated.`)
                        .setColor(colors.COLOR)
                        newMessage.author.send({ embeds: [SwearFound] }).catch(err => {
                        console.log("DMS Disabled.");
                    })
                    newMessage.delete().catch(err => {
                        console.log("Delete swearfilter error.");
                    });

                    if (guildDatabase.logEnabled === "false") return;
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setTitle("Swear Filter Triggered")
                            .addField("User", `${newMessage.author}`)
                            .addField("Swearword", `${Swears[i]}`)
                            .setFooter(`ID: ${newMessage.author.id}`)
                            .setColor(colors.COLOR)
                            .setTimestamp()
                        logChannel.send({ embeds: [embed] }).catch(err => {
                            console.log("Delete swearfilter error.");
                        });
                    }
                    return;
                }
            }
            if (!logChannel) return;

            if (guildDatabase.logEnabled === "false") return;

            const embed = new MessageEmbed()
                .setTitle("Message Updated!")
                .setTimestamp()
                .setFooter(`Message-ID: ${oldMessage.id}`)
                .setColor(colors.MESSAGE_UPDATED);

            let oldContent = String(oldMessage.content);
            let newContent = String(newMessage.content);

            if (newContent.length > 1024) newContent = "Too long for message embed.";

            if (oldMessage.content !== newMessage.content) {
                embed.addField("Content", `${oldContent} ** **`)
                embed.addField("Changed to", `${newContent} ** **`)
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
        } catch (e) {
            console.log(e);
            return;
        }
    }
};