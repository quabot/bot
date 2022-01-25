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

        try {
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

            const logChannel = oldEmoji.guild.channels.cache.get(guildDatabase.logChannelID);


            if (guildDatabase.logEnabled === "true") {
                if (logChannel) {
                    const embed = new MessageEmbed()
                        .setColor(colors.EMOJI_UPDATE)
                        .setTitle('Emoji Updated!')
                        .addField('Old Name', `${oldEmoji.name}`)
                        .addField('New Name', `${newEmoji.name}`)
                        .setFooter(`Emoji-ID: ${newEmoji.id}`, `${newEmoji.url}`)
                        .setTimestamp()
                    logChannel.send({ embeds: [embed] });
                };
            }
        } catch (e) {
            console.log(e);
            return;
        }

    }
}