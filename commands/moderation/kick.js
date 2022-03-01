const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { kickNoUser, kickImpossible } = require('../../embeds/moderation');
const { COLOR_MAIN } = require('../../files/colors.json');


module.exports = {
    name: "kick",
    description: "Kick a member.",
    permission: "KICK_MEMBERS",
    options: [
        {
            name: "user",
            description: "User to kick",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Reason for kick",
            type: "STRING",
            required: false,
        }
    ],
    async execute(client, interaction) {
        try {
            const member = interaction.options.getMember('user');
            const reasonRaw = interaction.options.getString('reason');
            let reason = "No reason specified.";

            if (!member) return interaction.reply({ embeds: [kickNoUser] }).catch(err => console.log(err));
            if (reasonRaw) reason = reasonRaw;

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
            let kicksCount;
            if (userDatabase) kicksCount = userDatabase.kickCount;
            if (!userDatabase) kicksCount = 0;
            if (kicksCount === undefined) kicksCount = 0;
            if (userDatabase) {
                await userDatabase.updateOne({
                    kickCount: kicksCount + 1
                });
            }
            if (!userDatabase) {
                const newUser = new User({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    typeScore: 0,
                    kickCount: 1,
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

            const userKicked = new MessageEmbed()
                .setTitle(":white_check_mark: User Kicked")
                .setDescription(`${member} was kicked.\n**Reason:** ${reason}`)
                .setColor(COLOR_MAIN)
                .setFooter(`Kick-ID: ${kicksCount + 1}`)

            member.kick({ reason: reason }).catch(err => {
                interaction.channel.send({ embeds: [kickImpossible] }).catch(err => console.log(err));
                let reason = ":x: Ban failed.";
                return;
            });
            interaction.reply({ embeds: [userKicked], split: true }).catch(err => console.log(err));
            const youWereKicked = new MessageEmbed()
                .setDescription(`You were kicked from one of your servers, **${interaction.guild.name}**.`)
                .addField("Kicked By", `${interaction.user}`)
                .addField("Reason", `${reason}`)
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
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            const Kicks = require('../../schemas/KickSchema');
            const newKicks = new Kicks({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                kickReason: `${reason}`,
                kickId: kicksCount + 1,
                kickedBy: interaction.user.id,
                kickChannel: interaction.channel.id,
                active: true,
            });
            newKicks.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                });


            if (!guildDatabase) return;
            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID)
                if (!logChannel) return;

                const embed = new MessageEmbed()
                    .setColor(`ORANGE`)
                    .setTitle('🔨 User Kicked')
                    .addField('Username', `${member.user.username}`)
                    .addField('User ID', `${member.id}`)
                    .addField('Kicked by', `${interaction.user}`)
                    .addField('Reason', `${reason}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed], split: true })
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