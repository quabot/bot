const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "tempban",
    description: 'Tempban a user.',
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "user",
            description: "The user you want to ban.",
            type: "USER",
            required: true,
        },
        {
            name: "duration",
            description: "How long you want to ban the user.",
            type: "STRING",
            required: true,
        },
        {
            name: "reason",
            description: "Why you want to ban that user.",
            type: "STRING",
            required: false,
        }
    ],
    async execute(client, interaction, color) {
        try {

            let member = interaction.options.getMember('user');
            let time = interaction.options.getString('duration');
            let reason = interaction.options.getString('reason');

            if (!ms(time)) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Please give a valid time to ban that user.`)
                        .setColor(color)
                ]
            }).catch((err => { }))

            if (!reason) reason = "No reason specified.";
            if (reason.length > 1000) reason = "No reason specified.";

            if (!member) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Please give a member to tempban.`)
                        .setColor(color)
                ]
            }).catch((err => { }))

            if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`You cannot tempban someone with a role higher than yours!`)
                        .setColor(color)
                ]
            }).catch((err => { }))

            member.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`You were tempbanned`)
                        .setDescription(`You were banned from one of your servers, **${interaction.guild.name}**.
                        **Banned by:** ${interaction.user}
                        **Duration:** ${time}
                        **Reason:** ${reason}`)
                        .setTimestamp()
                        .setColor(color)
                ]
            }).catch(err => { if (err.code !== 50007) console.log(err) });

            member.ban({ reason: reason }).catch(err => {
                if (err.code === 50013) return interaction.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`I do not have permission to ban that user.`)
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
                        banCount: 1,
                        kickCount: 0,
                        timeoutCount: 0,
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
                    banCount: userDatabase.banCount + 1,
                });
            }

            let bans;

            if (userDatabase) bans = userDatabase.banCount + 1;

            if (!bans) bans = 1;

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`User Tempbanned`)
                        .setDescription(`**User:** ${member}\n**Duration:** ${time}`)
                        .addFields(
                            { name: "Ban-ID", value: `${bans}`, inline: true },
                            { name: "Ban Reason", value: `${reason}`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                        )
                        .setColor(color)
                ]
            }).catch((err => { }))

            const Bans = require('../../structures/schemas/BanSchema');
            const newBans = new Bans({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                banReason: `${reason}`,
                banTime: new Date().getTime(),
                banId: bans,
                bannedBy: interaction.user.id,
                banChannel: interaction.channel.id,
                active: true,
            });
            newBans.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                });

            setTimeout(function () {
                interaction.guild.members.unban(member.id);
                interaction.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`${member} was unbanned after **${time}**!`)
                            .setColor(color)
                    ]
                }).catch((err => { }))
            }, ms(time));

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
                        suggestChannelID: "none",
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
                            .setColor("RED")
                            .setTitle("Member Tempbanned")
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