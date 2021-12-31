const discord = require('discord.js');
const mongoose = require('mongoose');
const colors = require('../../files/colors.json');
const config = require('../../files/config.json');

const { errorMain, addedDatabase } = require('../../files/embeds');

module.exports = {
    name: "punishments",
    description: "View someone's punishments",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "Use",
            type: "USER",
            required: true,
        },
        {
            name: "punishment",
            description: "Type: mute/kick/warn/ban",
            type: "STRING",
            required: true,
        }
    ],
    async execute(client, interaction) {
        try {
            
            
            const user = interaction.options.getMember('user');
            const punishment = interaction.options.getString('punishment');

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
                        closedTicketCategory: "Closed Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });

            const User = require('../../schemas/UserSchema');
            const userDatabase = await User.findOne({
                userId: user.id,
                guildId: interaction.guild.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new User({
                        userId: user.id,
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        typeScore: 0,
                        kickCount: 0,
                        banCount: 0,
                        warnCount: 0,
                        muteCount: 0,
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });

            const noVal = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle("Invalid Punishment!")
                .setDescription("Please pick: `kick/mute/ban/warn/all`!")
                .setTimestamp()
            const noPuns = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle("No Punishments found!")
                .setDescription("This user hasn't recieved (one of) these punishments yet!")
                .setTimestamp()

            if (!punishment === "kick" || !punishment === "mute" || !punishment === "ban" || !punishment === "warn" || !punishment == "all") return interaction.reply({ embeds: [noVal] });

            if (punishment === "kick") {
                const Kicks = require('../../schemas/KickSchema');
                const kickList = await Kicks.find({
                    userId: user.id,
                    guildId: interaction.guild.id,
                }, (err, kicks) => {
                    if (err) console.error(err);
                    if (!kicks) {
                        return interaction.channel.send({ embeds: [noPuns] });
                    }
                    return;
                });

                const kicks = kickList.map(e => `**Reason:**\n${e.kickReason}\n**Time**\n${e.kickTime}`);

                const kickEmbed = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setTitle(`${user.user.username}#${user.user.discriminator} Kick Logs`)
                    .setTimestamp()
                    .setDescription(`This user has been kicked \`${userDatabase.kickCount}\` times!\n\n${kicks.join("\n\n")}`)
                interaction.reply({ embeds: [kickEmbed] });
                return;
            }
            if (punishment === "ban") {
                const Bans = require('../../schemas/BanSchema');
                const banList = await Bans.find({
                    userId: user.id,
                    guildId: interaction.guild.id,
                }, (err, bans) => {
                    if (err) console.error(err);
                    if (!bans) {
                        return interaction.channel.send({ embeds: [noPuns] });
                    }
                    return;
                });

                const bans = banList.map(e => `**Reason:**\n${e.banReason}\n**Time**\n${e.banTime}`);

                const banEmbed = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setTitle(`${user.user.username}#${user.user.discriminator} Ban Logs`)
                    .setTimestamp()
                    .setDescription(`This user has been banned \`${userDatabase.banCount}\` times!\n\n${bans.join("\n\n")}`)
                interaction.reply({ embeds: [banEmbed] });
                return;
            }
            if (punishment === "mute") {
                const Mutes = require('../../schemas/MuteSchema');
                const muteList = await Mutes.find({
                    userId: user.id,
                    guildId: interaction.guild.id,
                }, (err, mutes) => {
                    if (err) console.error(err);
                    if (!mutes) {
                        return interaction.channel.send({ embeds: [noPuns] });
                    }
                    return;
                });

                const mutes = muteList.map(e => `**Reason:**\n${e.muteReason}\n**Time**\n${e.muteTime}`);

                const muteEmbed = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setTitle(`${user.user.username}#${user.user.discriminator} Mute Logs`)
                    .setTimestamp()
                    .setDescription(`This user has been muted \`${userDatabase.muteCount}\` times!\n\n${mutes.join("\n\n")}`)
                interaction.reply({ embeds: [muteEmbed] });
                return;
            }
            if (punishment === "warn") {
                const Warns = require('../../schemas/WarnSchema');
                const warnList = await Warns.find({
                    userId: user.id,
                    guildId: interaction.guild.id,
                }, (err, warns) => {
                    if (err) console.error(err);
                    if (!warns) {
                        return interaction.channel.send({ embeds: [noPuns] });
                    }
                    return;
                });

                const warns = warnList.map(e => `**Reason:**\n${e.warnReason}\n**Time**\n${e.warnTime}`);

                const warnEmbed = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setTitle(`${user.user.username}#${user.user.discriminator} Warn Logs`)
                    .setTimestamp()
                    .setDescription(`This user has been muted \`${userDatabase.warnCount}\` times!\n\n${warns.join("\n\n")}`)
                interaction.reply({ embeds: [warnEmbed] });
                return;
            }
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }

    }
}