const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "emojiCreate",
    /**
     * @param {Client} client 
     */
    async execute(emoji, client) {
        try {
        const Guild = require('../../schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: emoji.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: emoji.guild.id,
                    guildName: emoji.guild.name,
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
        const logChannel = emoji.guild.channels.cache.get(guildDatabase.logChannelID);

        if (guildDatabase.logEnabled === "true") {
            if (guildDatabase) {
                const embed = new MessageEmbed()
                    .setColor(colors.END_COLOR)
                    .setDescription(`${emoji}`)
                    .setTitle('Emoji Created!')
                    .addField('Emoji Name', `\`${emoji.name}\``, true)
                    .addField('Emoji-ID', `\`${emoji.id}\``, true)
                    .setTimestamp()
                if (emoji.animated === true) {
                    embed.addField(`Animated`, `${emoji.animated}`, true)
                }
                logChannel.send({ embeds: [embed] });
            };
        }
        } catch (e) {
            console.log(e);
            return;
        }
        
    }
}