const discord = require('discord.js');
const ms = require('ms');

const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const User = require('../../models/user');
const colors = require('../../files/colors.json');

const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR);
const noPermsManageRoles = new discord.MessageEmbed()
    .setDescription("I do not have permission to manage roles!")
    .setColor(colors.COLOR);
const noPermsBanUser = new discord.MessageEmbed()
    .setDescription("You do not have permission to ban members!")
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
    name: "tempmute",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `tempmute` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) return message.channel.send(noPermsManageRoles);
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send(noPermsBanUser);

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

        let mutedRoleName = settings.mutedRoleName;
        let mainRoleName = settings.mainRoleName;

        const target = message.mentions.users.first();

        if (!args[0]) return message.channel.send(noUser);
        if (!target) return message.channel.send(noUser);

        let mainRole = message.guild.roles.cache.find(role => role.name === `${mainRoleName}`);
        let muteRole = message.guild.roles.cache.find(role => role.name === `${mutedRoleName}`);

        let memberTarget = message.guild.members.cache.get(target.id);

        const time = args[1];

        if (!time) return message.channel.send(noTime);

        if (ms(time)) {
            memberTarget.roles.remove(mainRole.id);
            memberTarget.roles.add(muteRole.id);
            const mutedUser4 = new discord.MessageEmbed()
                .setDescription(`<@${memberTarget.user.id}> has been muted`)
                .setColor(colors.COLOR);
            message.channel.send(mutedUser4);
            setTimeout(function () {
                memberTarget.roles.add(mainRole.id);
                memberTarget.roles.remove(muteRole.id);
                const mutedUser23 = new discord.MessageEmbed()
                    .setDescription(`<@${memberTarget.user.id}> has been unmuted after ${ms(time)}!`)
                    .setColor(colors.COLOR);
                message.channel.send(mutedUser23);
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
                    muteCount: 1,
                    warnCount: 0,
                    kickCount: 0,
                    banCount: 0
                });

                await newUser.save()
                    .catch(err => console.error(err));
            } else {
                user.updateOne({
                    muteCount: user.muteCount + 1
                })
                    .catch(err => console.error(err));
            };
        });

        if (settings.enableLog === "true") {
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;

            const embed = new Discord.MessageEmbed()
                .setColor(colors.MUTE_COLOR)
                .setTitle('User Tempmuted')
                .addField('Username', target.user.username)
                .addField('User ID', target.id)
                .addField('Muted by', message.author)
                .addField('Time', ms(time))
            logChannel.send(embed);
        } else {
            return;
        }
    }
}