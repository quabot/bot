const discord = require('discord.js');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const { reportNoChannel, reportNoContent, reportsDisabled, errorMain, addedDatabase, reportNoUser, reportNoSelf } = require('../../files/embeds');

module.exports = {
    name: "report",
    aliases: ["reportuser", "ru", "userreport", "helpreport"],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

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
        if (settings.reportEnabled === "false") return message.channel.send({ embeds: [reportsDisabled] });
        const reportsChannel = message.guild.channels.cache.get(settings.reportChannelID);
        if (!reportsChannel) return message.channel.send({ embeds: [reportNoChannel] });

        const user = message.mentions.members.first();
        if (!user) return message.channel.send({ embeds: [reportNoUser] })
        if (user.id === message.author.id) return message.channel.send({ embeds: [reportNoSelf] });

        const content = args.slice(1).join(' ');
        if (!content) return message.channel.send({ embeds: [reportNoContent] });

        const embed = new discord.MessageEmbed()
            .setColor(colors.REPORT_COLOR)
            .setTitle("New User Report")
            .addField("User:", `${user}`, true)
            .addField("Reported By:", `${message.author}`, true)
            .addField("Reason for reporting:", `${content}`)
            .setTimestamp()
            .setFooter(`${message.guild.name}`)
        reportsChannel.send({embeds: [embed]});

        if (settings.enableLog === "true") {
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;

            const embed = new discord.MessageEmbed()
                .setColor(colors.REPORT_COLOR)
                .setTitle('User Reported')
                .addField('User', `${user}`)
                .addField('Reported By', `${message.author}`)
                .addField('Reason', `${content}`)
            logChannel.send({ embeds: [embed]});
        } else {
            return;
        }
    }
}