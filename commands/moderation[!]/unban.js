const discord = require('discord.js');

const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const colors = require('../../files/colors.json');

const { errorMain, banNoUserFound, banImpossible, addedDatabase, banNoPermsUser, unbanNoUser, banNoTime, muteNoManageRoles, muteNoPermsUser, muteNoTime, muteNoUser, banNoPermsBot } = require('../../files/embeds');


module.exports = {
    name: "unban",
    aliases: [],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [banNoPermsBot]});
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [banNoPermsUser]});

        const member = args[0];
        const memberid = args[0];
        const sender = message.author;

        if (!member || !memberid) return message.channel.send({ embeds: [unbanNoUser]});

        let userID = args[0]
        message.guild.bans.fetch().then(bans => {
            if (bans.size == 0) return
            let bUser = bans.find(b => b.user.id == userID)
            if (!bUser) return message.channel.send({ embeds: [banNoUserFound]})
            message.guild.members.unban(bUser.user)
            const unbannedUser = new discord.MessageEmbed()
                .setDescription(`Succesfully unbanned ${args[0]}.`)
                .setColor(colors.COLOR);
            message.channel.send({ embeds: [unbannedUser]});
        })

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
        const logChannel = message.guild.channels.cache.get(settings.logChannelID);

        const user = message.mentions.users.first();
        if (settings.enableLog === "true") {
            if (!logChannel) {
                return;
            } else {
                const embed = new discord.MessageEmbed()
                    .setColor(colors.UNBAN_COLOR)
                    .setTitle('User Unban')
                    .addField('Username', user)
                    .addField('User ID', memberid)
                    .addField('Unbanned by', message.author)
                return logChannel.send({ embeds: [embed] });
            };
        }
    }
}
