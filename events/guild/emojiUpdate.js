const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "emojiUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldEmoji, newEmoji, client) {

        const Guild = require('../../schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: newEmoji.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: newEmoji.guild.id,
                    guildName: newEmoji.guild.name,
                    logChannelID: "none",
                    reportChannelID: "none",
                    suggestChannelID: "none",
                    welcomeChannelID: "none",
                    levelChannelID: "none",
                    pollChannelID: "none",
                    ticketCategory: "Tickets",
                    closedTicketCategory: "Tickets",
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

        const logChannel = oldEmoji.guild.channels.cache.get(guildDatabase.logChannelID);


        if (guildDatabase.logEnabled === "true") {
            if (logChannel) {
                const embed = new MessageEmbed()
                    .setColor(colors.LIME)
                    .setTitle('Emoji Updated!')
                    .setDescription(`${newEmoji}`)
                    .addField('Emoji-ID', `\`${newEmoji.id}\``)
                    .addField('Emoji Name', `\`${oldEmoji.name}\`/\`${newEmoji.name}\``)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
            };
        }
    }
}