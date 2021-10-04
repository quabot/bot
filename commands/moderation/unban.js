const discord = require('discord.js');

const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const colors = require('../../files/colors.json');

const { errorMain, notBanned, banNoUserFound, banImpossible, addedDatabase, banNoPermsUser, unbanNoUser, banNoTime, muteNoManageRoles, muteNoPermsUser, muteNoTime, muteNoUser, banNoPermsBot } = require('../../files/embeds');


module.exports = {
    name: "unban",
    aliases: [],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [banNoPermsBot] });
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [banNoPermsUser] });

        if (!args[0]) return message.channel.send({ embeds: [unbanNoUser] });
        let bannedMember;
        try {
            bannedMember = await client.users.cache.get(args[0])
        } catch (e) {
            if (!bannedMember) return message.channel.send({ embeds: [unbanNoUser] });
        }

        try {
            await message.guild.bans.fetch(args[0])
        } catch (e) {
            message.channel.send({ embeds: [notBanned] });
            return;
        }

        try {
            message.guild.members.unban(args[0])
            const embed1 = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setDescription(`:white_check_mark: <@${args[0]}> has been unbanned.`)
            message.channel.send({ embeds: [embed1] })
        } catch (e) {
            console.log(e.message)
        }

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

        if (settings.enableLog === "true") {
            if (!logChannel) {
                return;
            } else {
                const embed = new discord.MessageEmbed()
                    .setColor(colors.UNBAN_COLOR)
                    .setTitle('User Unban')
                    .addField('Username', `<@${args[0]}>`)
                    .addField('User ID', `${args[0]}`)
                    .addField('Unbanned by', `${message.author}`)
                return logChannel.send({ embeds: [embed] });
            };
        }
    }
}
