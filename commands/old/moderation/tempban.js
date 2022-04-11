const { MessageEmbed } = require('discord.js');
const ms = require('ms');

const { error, added } = require('../../embeds/general');
const { banNoUser, banImpossible, banTime } = require('../../embeds/moderation');
const { COLOR_MAIN } = require('../../files/colors.json');


module.exports = {
    name: "tempban",
    description: "Tempban a member.",
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "user",
            description: "User to ban",
            type: "USER",
            required: true,
        },
        {
            name: "time",
            description: "Time to ban",
            type: "STRING",
            required: true,
        },
        {
            name: "reason",
            description: "Reason for ban",
            type: "STRING",
            required: false,
        }
    ],
    async execute(client, interaction) {
        try {
            const member = interaction.options.getMember('user');
            const time = interaction.options.getString('time');
            const reasonRaw = interaction.options.getString('reason');
            let reason = "No reason specified.";

            if (!member) return interaction.reply({ embeds: [banNoUser] }).catch(err => console.log(err));
            if (reasonRaw) reason = reasonRaw;

            if (!ms(time)) return interaction.reply({ embeds: [banTime] }).catch(err => console.log(err));

            const userBanned = new MessageEmbed()
                .setTitle(":white_check_mark: User Tempbanned")
                .setDescription(`${member} was banned.\n**Reason:** \`${reason}\`\n**Duration:** \`${time}\``)
                .setColor(COLOR_MAIN)

            member.ban({ reason: reason }).catch(err => {
                interaction.channel.send({ embeds: [banImpossible] }).catch(err => console.log(err));
                let reason = ":x: Ban failed.";
                return;
            });
            interaction.reply({ embeds: [userBanned], split: true }).catch(err => console.log(err));
            const youWereBanned = new MessageEmbed()
                .setDescription(`You were tempbanned from one of your servers, **${interaction.guild.name}**.`)
                .addField("Banned By", `${interaction.user}`)
                .addField("Reason", `\`${reason}\``)
                .addField("Duration", `\`${time}\``)
                .setColor(COLOR_MAIN);
            member.send({ embeds: [youWereBanned] }).catch(e => console.log("Failed to DM"));

            const User = require('../../schemas/UserSchema');
            const userDatabase = await User.findOne({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new User({
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        typeScore: 0,
                        kickCount: 0,
                        banCount: 0,
                        warnCount: 0,
                        muteCount: 0,
                        afk: false,
                        afkStatus: "none",
                        bio: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });
            let bansCount;
            if (userDatabase) bansCount = userDatabase.banCount;
            if (!userDatabase) bansCount = 0;
            if (bansCount === undefined) bansCount = 0;
            if (userDatabase) {
                await userDatabase.updateOne({
                    banCount: bansCount + 1
                });
            }
            if (!userDatabase) {
                const newUser = new User({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    typeScore: 0,
                    kickCount: 0,
                    banCount: 0,
                    warnCount: 0,
                    muteCount: 0,
                    afk: true,
                    afkStatus: "none",
                    bio: "none",
                });
                newUser.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                    });
            }

            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            const Bans = require('../../schemas/BanSchema');
            const newBans = new Bans({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                banReason: `${reason}`,
                banTime: new Date().getTime(),
                banId: bansCount + 1,
                bannedBy: interaction.user.id,
                banChannel: interaction.channel.id,
                active: true,
            });
            newBans.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                });

            setTimeout(function () {
                interaction.guild.members.unban(member.id);
                const unbannedAfter = new MessageEmbed()
                    .setDescription(`${member} was unbanned after **${time}**!`)
                    .setColor(COLOR_MAIN);
                interaction.channel.send({ embeds: [unbannedAfter] }).catch(err => console.log(err));
                if (!guildDatabase) return;
                if (guildDatabase.logEnabled === "true") {
                    const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID)
                    if (!logChannel) return;
                    if (!logChannel) {
                        return;
                    } else {
                        logChannel.send({ embeds: [unbannedAfter] }).catch(err => console.log(err));
                    };
                }
            }, ms(time));

            if (!guildDatabase) return;
            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID)
                if (!logChannel) return;

                const embed = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle('🔨 User Banned')
                    .addField('Username', `${member.user.username}`)
                    .addField('User ID', `${member.id}`)
                    .addField('Banned by', `${interaction.user}`)
                    .addField('Reason', `${reason}`)
                    
                logChannel.send({ embeds: [embed], split: true }).catch(err => console.log(err));
            } else {
                return;
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: ban`)] }).catch(err => console.log(err));;
            return;
        }
    }
}