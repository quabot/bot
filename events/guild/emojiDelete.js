const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: "emojiDelete",
    /**
     * @param {Client} client 
     */
    async execute(emoji, client) {

        const settings = await Guild.findOne({
            guildID: emoji.guild.id
        }, (err, guild) => {
            if (err) return;
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: emoji.guild.id,
                    guildName: emoji.guild.name,
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
        const logChannel = emoji.guild.channels.cache.get(settings.logChannelID);

        if (settings.enableLog === "true") {
            if (logChannel) {
                const embed = new MessageEmbed()
                    .setColor(colors.LOCK_COLOR)
                    .setTitle('Emoji Deleted!')
                    .addField('Emoji Name', `\`${emoji.name}\``, true)
                    .addField('Emoji-ID', `\`${emoji.id}\``, true)
                    .addField('Animated', `\`${emoji.animated}\``, true)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
            };
        }
    }
}