const discord = require('discord.js');
const mongoose = require('mongoose');
const colors = require('../../files/colors.json');
const User = require('../../models/user');
const Guild = require('../../models/guild');

const {errorMain, addedDatabase, clearpunNoType, clearpunNoMember} = require('../../files/embeds');

module.exports = {
    name: "clearpunishments",
    aliases: ["resetpunishments", "cp", "devcp"],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const type = args[0];
        const member = message.mentions.users.first();

        if (!type) return message.channel.send({ embeds: [clearpunNoType] });
        if (!args[1]) return message.channel.send({ embeds: [clearpunNoMember] });
        if (!member) return message.channel.send({ embeds: [clearpunNoMember] });

        const userDatabase = await User.findOne({
            guildID: message.guild.id,
            userID: member.id
        }, (err, User) => {
            if (err) message.channel.send({ embeds: [errorMain] });
            if (!User) {
                const newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    userID: member.id,
                    muteCount: 0,
                    warnCount: 0,
                    kickCount: 0,
                    banCount: 0
                });

                newUser.save()
                    .catch(err => message.channel.send({ embeds: [errorMain] }));
                return message.channel.send({ embeds: [addedDatabase] });
            }
        });

        if (type === "warn" || type === "kick" || type === "mute" || type === "ban") {
            if (type === "warn") {
                await userDatabase.updateOne({
                    warnCount: 0
                });
                const embed1 = new discord.MessageEmbed()
                    .setDescription(`:white_check_mark: Cleared all warnings for ${member}!`)
                    .setColor(colors.COLOR);
                message.channel.send({ embeds: [embed1] });
            }
            if (type === "kick") {
                await userDatabase.updateOne({
                    kickCount: 0
                });
                const embed2 = new discord.MessageEmbed()
                    .setDescription(`:white_check_mark: Cleared all kicks for ${member}!`)
                    .setColor(colors.COLOR);
                message.channel.send({ embeds: [embed2] });
            }
            if (type === "mute") {
                await userDatabase.updateOne({
                    muteCount: 0
                });
                const embed3 = new discord.MessageEmbed()
                    .setDescription(`:white_check_mark: Cleared all mutes for ${member}!`)
                    .setColor(colors.COLOR);
                message.channel.send({ embeds: [embed3] });
            }
            if (type === "ban") {
                await userDatabase.updateOne({
                    banCount: 0
                });
                const embed4 = new discord.MessageEmbed()
                    .setDescription(`:white_check_mark: Cleared all bans for ${member}!`)
                    .setColor(colors.COLOR);
                message.channel.send({ embeds: [embed4] });
            }
        } else return message.channel.send(noType);

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
                    mutedRoleName: muted,
                    mainRoleName: member
                });

                newGuild.save()
                    .catch(err => message.channel.send({ embeds: [errorMain] }));

                return message.channel.send({ embeds: [addedDatabase] });
            }
        });

        if (settings.enableLog === "true") {
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;

            const embed = new discord.MessageEmbed()
                .setColor(colors.CLEAR_COLOR)
                .setTitle(`User\'s ${type} Reset`)
                .addField('Punishment', `${type}`)
                .addField('User', `${member}`)
                .addField('User ID', `${member.id}`)
                .addField('Reset By', `${message.author}`);
            logChannel.send({ embeds: [embed] });
        } else {
            return;
        }
    }
}