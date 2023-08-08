const discord = require('discord.js');
const ms = require('ms');

const Guild = require('../models/guild');
const config = require('../../files/config.json');
const User = require('../../models/user');
const colors = require('../files/colors.json');

const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR);
const noPermsManageRoles = new discord.MessageEmbed()
    .setDescription("I do not have permission to manage roles!")
    .setColor(colors.COLOR);
const noPermsBanUser = new discord.MessageEmbed()
    .setDescription("You do not have permission to mute members!")
    .setColor(colors.COLOR);
const noUser = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("Please enter a valid user to ban!");
const noTime = new discord.MessageEmbed()
    .setDescription("Please enter a time to ban this user!")
    .setColor(colors.COLOR);
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)

module.exports = {
    name: "tempban",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `tempban` was used.");


        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(noPermsManageRoles);
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(noPermsBanUser);

        const user = message.mentions.users.first();
        const time = args[1];
        if (!args[0]) return message.channel.send("Please enter a user to tempban!");
        if (!user) return message.channel.send("Please enter a user to tempban!");
        if (!time) return message.channel.send(noTime);
        let reason = "No reason specified"; // ERROR?

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send(errorMain);
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
                    .catch(err => message.channel.send(errorMain));

                return message.channel.send(addedDatabase);
            }
        });
        
        if (ms(time)) {
            await message.guild.member(user).ban({ reason: reason });
            const embed = new discord.MessageEmbed()
                .setTitle("User Tempbanned")
                .setDescription(`${member} was tempbanned for ${ms(time)}.\n**Reason:** ${reason}`)
                .setColor(colors.COLOR)
            message.channel.send(embed);
            setTimeout(function () {
                message.guild.members.unban(user.id)
                const unbannedAfter = new discord.MessageEmbed()
                    .setDescription(`${user} was unbanned after ${time}!`)
                    .setColor(colors.COLOR);
                message.channel.send(unbannedAfter);
            }, ms(time));
        } else {
            return message.channel.send(noTime);
        }

        User.findOne({
            guildID: message.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err) console.error(err);

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
                    .catch(err => console.error(err));
            } else {
                User.updateOne({
                    banCount: User.banCount + 1
                })
                    .catch(err => console.error(err));
            };
        });

        if (settings.enableLog === "true") {
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) {
                return;
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(colors.BAN_COLOR)
                    .setTitle('User Tempbanned')
                    .addField('Username', member.username)
                    .addField('User ID', user.id)
                    .addField('Banned by', message.author)
                    .addField('Reason', reason)
                    .addField('Time', ms(time));
                return logChannel.send(embed);
            };
        }
    }
}