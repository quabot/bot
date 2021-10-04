const discord = require('discord.js');
const ms = require('ms');

const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const User = require('../../models/user');
const colors = require('../../files/colors.json');
const { errorMain, banImpossible, addedDatabase, banNoPermsUser, banNoUser, banNoTime, muteNoManageRoles, muteNoPermsUser, muteNoTime, muteNoUser } = require('../../files/embeds');

module.exports = {
    name: "tempmute",
    aliases: ["tm"],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) return message.channel.send({ embeds: [muteNoManageRoles] });
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [muteNoPermsUser] });

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

        let mutedRoleName = settings.mutedRoleName;
        let mainRoleName = settings.mainRoleName;

        const target = message.mentions.users.first();
        const member = message.mentions.members.first();

        if (!args[0]) return message.channel.send({ embeds: [{ embeds: [muteNoUser] }] });
        if (!target) return message.channel.send({ embeds: [muteNoUser] });

        let mainRole = message.guild.roles.cache.find(role => role.name === `${mainRoleName}`);
        let muteRole = message.guild.roles.cache.find(role => role.name === `${mutedRoleName}`);

        let memberTarget = message.guild.members.cache.get(target.id);

        const time = args[1];

        if (!time) return message.channel.send({ embeds: [muteNoTime] });

        if (ms(time)) {
            memberTarget.roles.remove(mainRole.id);
            memberTarget.roles.add(muteRole.id);
            const mutedUser4 = new discord.MessageEmbed()
                .setTitle("User tempmuted")
                .setDescription(`<@${memberTarget.user.id}> has been tempmuted for ${time}`)
                .setColor(colors.COLOR);
            message.channel.send({ embeds: [mutedUser4] });
            setTimeout(function () {
                memberTarget.roles.add(mainRole.id);
                memberTarget.roles.remove(muteRole.id);
                const mutedUser23 = new discord.MessageEmbed()
                    .setTitle("User auto-unmuted")
                    .setDescription(`<@${memberTarget.user.id}> has been unmuted after ${time}!`)
                    .setColor(colors.COLOR);
                message.channel.send({ embeds: [mutedUser23] });
            }, ms(time));
        } else {
            return message.channel.send({ embeds: { muteNoTime } });
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

            const embed = new discord.MessageEmbed()
                .setColor(colors.MUTE_COLOR)
                .setTitle('User Tempmuted')
                .addField('User', `${target.tag}`)
                .addField('User ID', `${target.id}`)
                .addField('Muted by', `${message.author}`)
                .addField('Time', `${time}`)
            logChannel.send({ embeds: [embed] });
        } else {
            return;
        }
    }
}