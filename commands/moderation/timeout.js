const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "timeout",
    description: "Timeout a user.",
    permission: "MODERATE_MEMBERS",
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
    async execute(client, interaction, color) {
        try {

            let member = interaction.options.getMember('user');
            let reason = interaction.options.getString('reason');
            const time = interaction.options.getString('time');
            if (!reason) reason = "No reason specified.";
            if (reason.length > 1000) reason = "No reason specified.";

            if (!member) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Please give a member to timeout.`)
                        .setColor(color)
                ]
            }).catch((err => { }))

            if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`You cannot timeout someone with a role higher than yours!`)
                        .setColor(color)
                ]
            }).catch((err => { }))

            if (!ms(time)) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Please give a time to timeout that member for.`)
                        .setColor(color)
                ]
            }).catch((err => { }))

            member.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`You were timed out`)
                        .setDescription(`You were timed out on one of your servers, **${interaction.guild.name}**.
                        **Timed out by:** ${interaction.user}
                        **Duration:** ${time}
                        **Reason:** ${reason}`)
                        .setTimestamp()
                        .setColor(color)
                ]
            }).catch(err => { if (err.code !== 50007) console.log(err) });

            member.timeout(ms(time), `${reason}`).catch(err => {
                if (err.code === 50013) return interaction.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`I do not have permission to timeout that user.`)
                            .setColor(color)
                    ]
                }).catch((err => { }))
            });

            const User = require('../../structures/schemas/UserSchema');
            const userDatabase = await User.findOne({
                userId: member.id,
                guildId: interaction.guild.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new User({
                        userId: member.id,
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        banCount: 0,
                        kickCount: 0,
                        timeoutCount: 1,
                        warnCount: 0,
                        updateNotify: true,
                        lastNotify: "none",
                        afk: false,
                        afkMessage: "none",
                        bio: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (userDatabase) {
                await userDatabase.updateOne({
                    timeoutCount: userDatabase.timeoutCount + 1,
                });
            }

            let timeouts;

            if (userDatabase) timeouts = userDatabase.timeoutCount;

            if (!timeouts) timeouts = 1;

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`User Timed Out`)
                        .setDescription(`**User:** ${member}\n**Duration:** ${time}`)
                        .setColor(color)
                        .addFields(
                            { name: "Timeout-ID", value: `${timeouts}`, inline: true },
                            { name: "Timeout Reason", value: `${reason}`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                        )
                ]
            }).catch((err => { }))

            const Timeouts = require('../../structures/schemas/TimeoutSchema');
            const newTimeout = new Timeouts({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                timeoutReason: `${reason}`,
                timeoutId: timeouts,
                timedoutTime: new Date().getTime(),
                timedoutBy: interaction.user.id,
                timeoutChannel: interaction.channel.id,
                active: true,
            });
            newTimeout.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [error] }).catch((err => { }))
                });

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        afkStatusAllowed: "true",
                        musicEnabled: "true",
                        musicOneChannelEnabled: "false",
                        musicChannelID: "none",
                        suggestChannelID: "none",
                        logSuggestChannelID: "none",
                        logPollChannelID: "none",
                        afkEnabled: true,
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        logEnabled: true,
                        modEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        suggestEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        roleEnabled: false,
                        mainRole: "none",
                        joinMessage: "Welcome {user} to **{guild}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;
            if (guildDatabase.modEnabled === "false") return;
            const channel = interaction.guild.channels.cache.get(`${guildDatabase.punishmentChannelID}`);

            if (channel.type !== "GUILD_TEXT" || channel.type !== "GUILD_NEWS")

                channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor("YELLOW")
                            .setTitle("Member Timedout")
                            .addFields(
                                { name: "Member", value: `${member}`, inline: true },
                                { name: "Reason", value: `${reason}`, inline: true },
                                { name: "Duration", value: `${time}`, inline: true },
                                { name: "Staff", value: `${interaction.user}`, inline: true },
                                { name: "Channel", value: `${interaction.channel}`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                            )
                            .setTimestamp()
                            .setFooter({ text: `Command: /${this.name}` })
                    ]
                }).catch((err => { }));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}