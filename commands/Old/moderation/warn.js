const discord = require("discord.js");
const mongoose = require('mongoose');

const User = require('../../../models/user');
const Guild = require('../../../models/guild');
const config = require('../../../files/config.json');
const colors = require('../../../files/colors.json');

const { errorMain, warnNoPerms, warnNoUserToWarn, warnNotHigherRole, addedDatabase } = require('../../../files/embeds');

module.exports = {
    name: "warn",
    aliases: [],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [warnNoPerms] });

        let reason = "No reason specified";

        const member = message.mentions.members.first();

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
        const logChannel = message.guild.channels.cache.get(settings.logChannelID);

        if (!member)
            return message.channel.send({ embeds: [warnNoUserToWarn] });

        if (message.member.roles.highest.position < member.roles.highest.position)
            return message.channel.send({ embeds: [warnNotHigherRole] });

        User.findOne({
            guildID: message.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err)

                if (!user) {
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
                        .catch(err => {
                            console.error(err);
                            message.channel.send({ embeds: [errorMain] });
                        })
                } else {
                    User.updateOne({
                        warnCount: User.warnCount + 1
                    })
                        .catch(err => {
                            console.error(err);
                            message.channel.send({ embeds: [errorMain] });
                        })
                };
        });

        if (args.length > 1) reason = args.slice(1).join(' ');

        const warnedEmbed = new discord.MessageEmbed()
            .setDescription(`${member} was warned\nReason: **${reason}**`)
            .setColor(colors.COLOR);
        message.channel.send({ embeds: [warnedEmbed] });

        if (settings.enableLog === "true") {
            if (!logChannel) {
                return
            } else {
                const embed = new discord.MessageEmbed()
                    .setColor(colors.WARN_COLOR)
                    .setTitle('User Warned')
                    .addField('Username', `${member.user.username}`)
                    .addField('User ID', `${member.id}`)
                    .addField('Warned by', `${message.author}`)
                    .addField('Reason', `${reason}`);

                return logChannel.send({ embeds: [embed] });
            };
        }
    }
}