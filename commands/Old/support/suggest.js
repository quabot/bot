const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const Guild = require('../../models/guild');
const { errorMain, noSuggestChannelConfigured, suggestTooShort, addedDatabase, suggestDisabled } = require('../../files/embeds');

module.exports = {
    name: "suggest",
    aliases: ["suggestion"],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return message.delete({ timeout: 5000 });

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.PREFIX,
                    logChannelID: none,
                    enableLog: false,
                    enableSwearFilter: true,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: none,
                    suggestEnabled: true,
                    suggestChannelID: none,
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                });

                newGuild.save()
                    .catch(err => message.channel.send({ embeds: [errorMain] }));

                return message.channel.send({ embeds: [addedDatabase] });
            }
        });

        if (settings.suggestEnabled === "false") return message.channel.send({ embeds: [suggestDisabled] });
        const suggestChannel = message.guild.channels.cache.get(settings.suggestChannelID);
        if (!suggestChannel) return message.channel.send({ embeds: [noSuggestChannelConfigured] });

        const suggestionContent = args.slice(0).join(' ');

        if (suggestionContent.length < 3) return message.channel.send({ embeds: [suggestTooShort] });

        const embed = new discord.MessageEmbed()
            .setColor(colors.SUGGEST_COLOR)
            .setTitle("New Suggestion!")
            .addField("Suggested by:", `${message.author}`)
            .addField("Suggestion:", `${suggestionContent}`)
            .setTimestamp()
        suggestChannel.send({ embeds: [embed] });

        if (settings.enableLog === "true") {
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;
            const embed2 = new discord.MessageEmbed()
                .setColor(colors.KICK_COLOR)
                .setTitle("New Suggestion")
                .addField("Suggested by:", `${message.author}`, true)
                .addField("User ID:", `${message.author.id}`, true)
                .addField("Suggestion:", `${suggestionContent}`)
                .setTimestamp()
            logChannel.send({ embeds: [embed2   ] });
        } else {
            return;
        }
    }
}