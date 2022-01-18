const colors = require('../../files/colors.json');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
const consola = require('consola');
const { errorMain, addedDatabase } = require('../../files/embeds.js');
module.exports = {
    name: "messageDelete",
    /**
     * @param {Client} client 
     */
    async execute(message) {

        try {
            if (message.guildId === null) return;

            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: message.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: message.guild.id,
                        guildName: message.guild.name,
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
            const logChannel = message.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!logChannel) return;

            if (guildDatabase.logEnabled === "false") return;

            const embed = new MessageEmbed()
                .setTitle("Message Deleted!")
                .setTimestamp()
                .setFooter(`Message-ID: ${message.id}`)
                .setColor(colors.MESSAGE_DELETE);

            let content = String(message.content);

            if (content.length > 1024) content = "Too long for message embed.";

            if (message.content === null || message.content === '') { } else {
                embed.addField("Content", `${content} ** **`)
            }
            embed.addField("Channel", `${message.channel} ** **`)
            if (message.author === null || message.author === '') { } else {
                embed.addField("User", `${message.author} ** **`)
            }
            if (message.attachments !== null) {
                message.attachments.map(getUrls);
                function getUrls(item) {
                    embed.addField(`**Attachments:**`, `${[item.url].join(" ")}`)
                }
            }

            logChannel.send({ embeds: [embed] })
        } catch (e) {
            console.log(e);
            return;
        }
    }
};