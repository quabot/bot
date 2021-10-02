const discord = require('discord.js');
const ms = require('ms');
const mongoose = require('mongoose');

const Guild = require('../../models/guild');

const config = require('../../files/config.json');
const User = require('../../models/user');
const colors = require('../../files/colors.json');
const {errorMain, banImpossible, addedDatabase, banNoPermsUser, banNoUser, banNoTime} = require('../../files/embeds');

module.exports = {
    name: "tempban",
    aliases: ["tb"],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [banNoPermsUser] });

        const member = message.mentions.members.first();
        const time = args[1];
        if (!args[0]) return message.channel.send({ embeds: [banNoUser] });
        if (!member) return message.channel.send({ embeds: [banNoUser] });
        if (!time) return message.channel.send({ embeds: [banNoTime] });
        let reason = "No reason specified";

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
                    reportChannelID: none
                });

                newGuild.save()
                    .catch(err => message.channel.send({ embeds: [errorMain] }));

                return message.channel.send({ embeds: [addedDatabase] });
            }
        });
        
        if (ms(time)) {
            member.ban({ reason: reason }).catch(err => {
                message.channel.send({embeds: [banImpossible]});
                let reason = ":x: Ban failed.";
                return;
            }); 
            const embed = new discord.MessageEmbed()
                .setTitle("User Tempbanned")
                .setDescription(`${member} was tempbanned for **${time}**.\n**Reason:** ${reason}`)
                .setColor(colors.COLOR)
            message.channel.send({ embeds: [embed] });
            setTimeout(function () {
                message.guild.members.unban(member.id);
                const unbannedAfter = new discord.MessageEmbed()
                    .setDescription(`${member} was unbanned after **${time}**!`)
                    .setColor(colors.COLOR);
                message.channel.send({ embeds: [unbannedAfter] });
                if (settings.enableLog === "true") {
                    const logChannel = message.guild.channels.cache.get(settings.logChannelID);
                    if (!logChannel) {
                        return;
                    } else {
                        logChannel.send({ embeds: [unbannedAfter] });
                    };
                }
            }, ms(time));
        } else {
            return message.channel.send({ embeds: [banNoTime] });
        }

        User.findOne({
            guildID: message.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err) console.error(err);

            if (!User) {
                const newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    userID: member.id,
                    muteCount: 0,
                    warnCount: 0,
                    kickCount: 0,
                    banCount: 1
                });

                await newUser.save()
                    .catch(err => message.channel.send({ embeds: [errorMain] }));
            } else {
                User.updateOne({
                    banCount: User.banCount + 1
                })
                    .catch(err => message.channel.send({ embeds: [errorMain] }));
            };
        });

        if (settings.enableLog === "true") {
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) {
                return;
            } else {
                const embed = new discord.MessageEmbed()
                    .setColor(colors.BAN_COLOR)
                    .setTitle('User Tempbanned')
                    .addField('Username', `${member.tag}`)
                    .addField('User ID', `${member.id}`)
                    .addField('Banned by', `${message.author}`)
                    .addField('Reason', `${reason}`)
                    .addField('Time', `${time}`);
                return logChannel.send({ embeds: [embed] });
            };
        }
    }
}