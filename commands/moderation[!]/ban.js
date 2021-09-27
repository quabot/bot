const discord = require('discord.js');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const User = require('../../models/guild');
const mongoose = require('mongoose');

const {errorMain, addedDatabase, banNoPermsBot, banNoPermsUser, banNoUser, banImpossible} = require('../../files/embeds');

module.exports = {
    name: "ban",
    aliases: [],
    async execute(client, message, args) {

        const member = message.mentions.members.first();// || client.users.cache.find(user => user.id === args[0]);
        let reason = "No reason specified.";

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [banNoPermsBot]});
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [banNoPermsUser]});

        if (!member) return message.channel.send({embeds: [banNoUser]});
        if (args.length > 1) reason = args.slice(1).join(' ');
;
        const userBanned = new discord.MessageEmbed()
            .setTitle(":white_check_mark: User Banned")
            .setDescription(`${member} was banned.\n**Reason:** ${reason}`)
            .setColor(colors.COLOR)

        member.ban({ reason: reason }).catch(err => {
            message.channel.send({embeds: [banImpossible]});
            let reason = ":x: Ban failed. Reason: " + reason;
            return;
        }); 
        message.channel.send({embeds: [userBanned], split: true}).catch(err => logChannel.send("There was an error! The reason probably exceeded the 1024 character limit."));        ;
        
        User.findOne({
            guildID: message.guild.id,
            userID: member.id,
        }, async (err, User) => {
            if(err) message.channel.send({embeds: [errorMain]});
            if(!User) {
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
                    .catch(err => message.channel.send({embeds: [errorMain]}));
            } else {
                User.updateOne({
                    banCount: User.banCount + 1
                })
                    .catch(err => message.channel.send({embeds: [errorMain]}));
            };
        });

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send({embeds: [errorMain]});
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.PREFIX,
                    logChannelID: "none",
                    enableLog: false,
                    enableSwearFilter: true,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: muted,
                    mainRoleName: member
                });

                newGuild.save()
                    .catch(err => message.channel.send({embeds: [errorMain]}));

                return message.channel.send({embeds: [addedDatabase]});
            }
        });

        if (settings.enableLog === "true") {
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;

            const embed = new discord.MessageEmbed()
                .setColor(colors.BAN_COLOR)
                .setTitle('User Banned')
                .addField('Username', `${member.user.username}`)
                .addField('User ID', `${member.id}`)
                .addField('Banned by', `${message.author}`)
                .addField('Reason', `${reason}`);
            logChannel.send({ embeds: [embed], split: true }).catch(err => logChannel.send("There was an error! The reason probably exceeded the 1024 character limit."));            ;
        } else {
            return;
        }

    }
}