const { MessageEmbed } = require('discord.js');
const ms = require('ms');

const { error, added } = require('../../embeds/general');
const { kickNoUser, kickImpossible, timoutTime } = require('../../embeds/moderation');
const { COLOR_MAIN } = require('../../files/colors.json');


module.exports = {
    name: "timeout",
    description: "Timeout a member.",
    permission: "KICK_MEMBERS",
    options: [
        {
            name: "user",
            description: "User to timeout",
            type: "USER",
            required: true,
        },
        {
            name: "time",
            description: "Time to timeout",
            type: "STRING",
            required: true,
        },
        {
            name: "reason",
            description: "Reason for timeout",
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

            if (!member) return interaction.reply({ embeds: [kickNoUser] }).catch(err => console.log("Error!"));
            if (reasonRaw) reason = reasonRaw;

            if (!ms(time)) return interaction.reply({ embeds: [timoutTime] }).catch(err => console.log("Error!"));

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
                        afk: true,
                        afkStatus: "none",
                        bio: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });
            let timeoutsCount;
            if (userDatabase) timeoutsCount = userDatabase.muteCount;
            if (!userDatabase) timeoutsCount = 0;
            if (timeoutsCount === undefined) timeoutsCount = 0;
            if (userDatabase) {
                await userDatabase.updateOne({
                    muteCount: timeoutsCount + 1
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
                    muteCount: 01,
                    afk: true,
                    afkStatus: "none",
                    bio: "none",
                });
                newUser.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                    });
            }

            const userKicked = new MessageEmbed()
                .setTitle(":white_check_mark: User Timed-out")
                .setDescription(`${member} was timed out.\n**Reason:** \`${reason}\`\n**Duration:** \`${time}\``)
                .setColor(COLOR_MAIN)
                .setFooter(`Timeout-ID: ${timeoutsCount + 1}`)

            member.timeout(ms(time), `${reason}`).catch(err => {
                interaction.channel.send({ embeds: [kickImpossible] }).catch(err => console.log("Error!"));
                let reason = ":x: Timeout failed.";
                return;
            });
            interaction.reply({ embeds: [userKicked], split: true }).catch(err => console.log("Error!"));
            const youWereKicked = new MessageEmbed()
                .setDescription(`You were timed out on one of your servers, **${interaction.guild.name}**.`)
                .addField("Timed Out By", `${interaction.user}`)
                .addField("Reason", `${reason}`)
                .addField("Duration", `${time}`)
                .setColor(COLOR_MAIN);
            member.send({ embeds: [youWereKicked] }).catch(e => console.log("Failed to DM"));


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
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                }
            }).clone().catch(function (err) { console.log(err) });

            const Timeouts = require('../../schemas/TimeoutSchema');
            const newTimeout = new Timeouts({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                timeoutReason: `${reason}`,
                timeoutId: timeoutsCount + 1,
                timedoutTime: new Date().getTime(),
                timedoutBy: interaction.user.id,
                timeoutChannel: interaction.channel.id,
                active: true,
            });
            newTimeout.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                });


            if (!guildDatabase) return;
            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID)
                if (!logChannel) return;

                const embed = new MessageEmbed()
                    .setColor(`YELLOW`)
                    .setTitle('🔨 User Timed Out')
                    .addField('Username', `${member.user.username}`)
                    .addField('User ID', `${member.id}`)
                    .addField('Timed Out by', `${interaction.user}`)
                    .addField('Duration', `${time}`)
                    .addField('Reason', `${reason}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed], split: true })
            } else {
                return;
            }
        } catch (e) {

            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: ban`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}