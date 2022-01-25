const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "emojiDelete",
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
            const logChannel = emoji.guild.channels.cache.get(guildDatabase.logChannelID);

            if (guildDatabase.logEnabled === "true") {
                if (logChannel) {
                    const embed = new MessageEmbed()
                        .setColor(colors.EMOJI_DELETE)
                        .setTitle('Emoji Deleted!')
                        .addField('Emoji Name', `${emoji.name}`)
                        .setFooter(`Emoji-ID: ${emoji.id}`, `${emoji.url}`)
                        .setTimestamp();
                    if (emoji.animated === true) {
                        embed.addField(`Animated`, `${emoji.animated}`, true)
                    }
                    embed.setTimestamp()
                    logChannel.send({ embeds: [embed] });
                };
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
}