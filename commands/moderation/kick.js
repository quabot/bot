const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "kick",
    description: 'Kick a user.',
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "user",
            description: "The user you want to kick.",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Why you want to kick that user.",
            type: "STRING",
            required: false,
        }
    ],
    async execute(client, interaction, color) {
        try {

            let member = interaction.options.getMember('user');
            let reason = interaction.options.getString('reason');
            if (!reason) reason = "No reason specified.";
            if (reason.length > 1000) reason = "No reason specified.";

            if (!member) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Please give a member to kick.`)
                        .setColor(color)
                ]
            }).catch((err => { }))

            if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`You cannot kick someone with a role higher than yours!`)
                        .setColor(color)
                ]
            }).catch((err => { }))

            member.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`You were kicked`)
                        .setDescription(`You were kicked from one of your servers, **${interaction.guild.name}**.
                        **Kicked by:** ${interaction.user}
                        **Reason:** ${reason}`)
                        .setTimestamp()
                        .setColor(color)
                ]
            }).catch(err => {
                if (err.code !== 50007) {
                    console.log(err);
                }
            });

            member.kick({ reason: reason }).catch(err => {
                if (err.code === 50013) return interaction.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`I do not have permission to kick that user.`)
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
                        kickCount: 1,
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
                    kickCount: userDatabase.kickCount + 1,
                });
            }

            let kicks;

            if (userDatabase) kicks = userDatabase.kickCount + 1;
            if (!kicks) kicks = 1;

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`User Kicked`)
                        .setDescription(`**User:** ${member}`)
                        .setColor(color)
                        .addFields(
                            { name: "Kick-ID", value: `${kicks}`, inline: true },
                            { name: "Kick Reason", value: `${reason}`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                        )
                ]
            }).catch((err => { }))

            const Kicks = require('../../structures/schemas/KickSchema');
            const newKicks = new Kicks({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                kickReason: `${reason}`,
                kickTime: new Date().getTime(),
                kickId: kicks,
                kickedBy: interaction.user.id,
                kickChannel: interaction.channel.id,
                active: true,
            });
            newKicks.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
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
                        suggestChannelID: "none",
                        logSuggestChannelID: "none",
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
                            .setColor("ORANGE")
                            .setTitle("Member Kicked")
                            .addFields(
                                { name: "Member", value: `${member}`, inline: true },
                                { name: "Reason", value: `${reason}`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
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