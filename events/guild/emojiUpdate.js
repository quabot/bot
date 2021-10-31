const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: "emojiUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldEmoji, newEmoji, client) {

        const settings = await Guild.findOne({
            guildID: oldEmoji.guild.id
        }, (err, guild) => {
            if (err) return;
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: oldEmoji.guild.id,
                    guildName: oldEmoji.guild.name,
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
        const logChannel = oldEmoji.guild.channels.cache.get(settings.logChannelID);

        if (settings.enableLog === "true") {
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