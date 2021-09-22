const discord = require("discord.js");
const mongoose = require('mongoose');

const User = require('../../models/user');
const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const colors = require('../../files/colors.json');

const noPermsBanUser = new discord.MessageEmbed()
    .setDescription("You do not have permission to warn members! `BAN_MEMBERS`")
    .setColor(colors.COLOR);
const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
const noUserToWarn = new discord.MessageEmbed()
    .setDescription("Please mention a user you want to warn!")
    .setColor(colors.COLOR)
const notHigherRole = new discord.MessageEmbed()
    .setDescription("You cannot warn someone with a higher role than you!")
    .setColor(colors.COLOR)

module.exports = {
    name: "warn",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `warn` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send(noPermsBanUser);
        
        let reason = "No reason specified";

        const member = message.mentions.members.first();

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
        const logChannel = message.guild.channels.cache.get(settings.logChannelID);

        if (!member)
            return message.channel.send(noUserToWarn);

        if (message.member.roles.highest.position < member.roles.highest.position)
            return message.channel.send(notHigherRole);

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
                    .catch(err => message.channel.send(errorMain));
            } else {
                User.updateOne({
                    warnCount: User.warnCount + 1
                })
                    .catch(err => message.channel.send(errorMain));
            };
        });

        if (args.length > 1) reason = args.slice(1).join(' ');

        const warnedEmbed = new discord.MessageEmbed()
            .setDescription(`${member} was warned\nReason: **${reason}**`)
            .setColor(colors.COLOR);
        message.channel.send(warnedEmbed);

        if (settings.enableLog === "true") {
            if (!logChannel) {
                return
            } else {
                const embed = new discord.MessageEmbed()
                    .setColor(colors.WARN_COLOR)
                    .setTitle('User Warned')
                    .addField('Username', member.user.username)
                    .addField('User ID', member.id)
                    .addField('Warned by', message.author)
                    .addField('Reason', reason);

                return logChannel.send(embed);
            };
        }
    }
}