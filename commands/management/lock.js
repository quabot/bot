const discord = require('discord.js');
const mongoose = require('mongoose');
const ms = require('ms');

const colors = require('../../files/colors.json');
const { errorMain, addedDatabase } = require('../../files/embeds');

const noValidChannel = new discord.MessageEmbed()
    .setDescription(":x: Please enter a valid text channel to lock!")
    .setColor(colors.COLOR)
    .setTimestamp()
const invalidTime = new discord.MessageEmbed()
    .setDescription(":x: Please enter a valid duration!")
    .setColor(colors.COLOR)

module.exports = {
    name: "lock",
    description: "Lock a channel.",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "reason",
            description: "Reason to lock",
            type: "STRING",
            required: false,
        },
        {
            name: "channel",
            description: "Channel to lock",
            type: "CHANNEL",
            required: false,
        },
        {
            name: "duration",
            description: "Duration to lock",
            type: "STRING",
            required: false,
        },
    ],
    async execute(client, interaction) {

        try {
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
                        levelEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
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

            const duration = interaction.options.getString('duration');
            const channel = interaction.options.getChannel('channel');
            const reasonRaw = interaction.options.getString('reason');

            let reason = "No reason specified";
            if (reasonRaw) reason = reasonRaw;

            let mainRoleName = guildDatabase.mainRole;
            let mainRole = interaction.guild.roles.cache.find(role => role.name === `${mainRoleName}`);

            if (!duration) {
                if (!channel) {
                    const lockChannel = interaction.channel;
                    lockChannel.permissionOverwrites.edit(mainRole, {
                        SEND_MESSAGES: false
                    });
                    lockChannel.permissionOverwrites.edit(interaction.guild.id, {
                        SEND_MESSAGES: false
                    });
                    const lockedEmbed = new discord.MessageEmbed()
                        .setTitle(":lock: Channel Locked!")
                        .setDescription(`This channel was locked by ${interaction.user}.`)
                        .addField(`Reason`, `${reason}`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [lockedEmbed] });
                    if (guildDatabase.logEnabled === "true") {
                        const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                        if (!logChannel) return;
                        const embed = new discord.MessageEmbed()
                            .setColor(colors.CLEAR_COLOR)
                            .setTitle('Channel Locked')
                            .addField('Channel', `${interaction.channel}`)
                            .addField('Locked by', `${interaction.user}`)
                            .addField(`Reason`, `${reason}`)
                            .setTimestamp();
                        logChannel.send({ embeds: [embed] });
                    } else {
                        return;
                    }
                } else if (channel) {
                    if (channel.type !== "GUILD_TEXT") {
                        return interaction.reply({ embeds: [noValidChannel] });
                    }
                    channel.permissionOverwrites.edit(mainRole, {
                        SEND_MESSAGES: false
                    });
                    channel.permissionOverwrites.edit(interaction.guild.id, {
                        SEND_MESSAGES: false
                    });
                    const lockedChannelEmbed = new discord.MessageEmbed()
                        .setTitle(":lock: Channel Locked!")
                        .addField("Channel", `${channel}`)
                        .addField(`Reason`, `${reason}`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    const lockedEmbed = new discord.MessageEmbed()
                        .setTitle(":lock: Channel Locked!")
                        .setDescription(`This channel was locked by ${interaction.user}.`)
                        .addField(`Reason`, `${reason}`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    channel.send({ embeds: [lockedEmbed] });
                    interaction.reply({ embeds: [lockedChannelEmbed] })
                    if (guildDatabase.logEnabled === "true") {
                        const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                        if (!logChannel) return;
                        const embed = new discord.MessageEmbed()
                            .setColor(colors.CLEAR_COLOR)
                            .setTitle('Channel Locked')
                            .addField('Channel', `${channel}`)
                            .addField('Locked by', `${interaction.user}`)
                            .addField(`Reason`, `${reason}`)
                            .setTimestamp();
                        logChannel.send({ embeds: [embed] });
                    } else {
                        return;
                    }
                }
            } else if (duration) {
                if (!channel) {
                    if (ms(duration)) {
                        const lockChannel = interaction.channel;
                        lockChannel.permissionOverwrites.edit(mainRole, {
                            SEND_MESSAGES: false
                        });
                        lockChannel.permissionOverwrites.edit(interaction.guild.id, {
                            SEND_MESSAGES: false
                        });
                        const lockedEmbed = new discord.MessageEmbed()
                            .setTitle(":lock: Channel Locked!")
                            .setDescription(`This channel was locked by ${interaction.user}.`)
                            .addField(`Reason`, `${reason}`)
                            .addField(`Duration`, `${duration}`)
                            .setColor(colors.COLOR)
                            .setTimestamp()
                        interaction.reply({ embeds: [lockedEmbed] });
                        setTimeout(function () {
                            lockChannel.permissionOverwrites.edit(mainRole, {
                                SEND_MESSAGES: true
                            });
                            lockChannel.permissionOverwrites.edit(interaction.guild.id, {
                                SEND_MESSAGES: true
                            });
                            const unlockedEmbed = new discord.MessageEmbed()
                                .setTitle(":unlock: Channel Unlocked!")
                                .setDescription(`This channel was automatically unlocked after ${duration}.`)
                                .setColor(colors.COLOR)
                                .setTimestamp()
                            lockChannel.send({ embeds: [unlockedEmbed] });
                            if (guildDatabase.logEnabled === "true") {
                                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                                if (!logChannel) return;
                                const embed = new discord.MessageEmbed()
                                    .setColor(colors.CLEAR_COLOR)
                                    .setTitle('Channel Auto Unlocked')
                                    .addField('Channel', `${interaction.channel}`)
                                    .addField('Locked by', `${interaction.user}`)
                                    .addField(`Reason`, `${reason}`)
                                    .addField(`Locked for`, `${duration}`)
                                    .setTimestamp();
                                logChannel.send({ embeds: [embed] });
                            } else {
                                return;
                            }
                        }, ms(duration));
                        if (guildDatabase.logEnabled === "true") {
                            const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                            if (!logChannel) return;
                            const embed = new discord.MessageEmbed()
                                .setColor(colors.CLEAR_COLOR)
                                .setTitle('Channel Locked')
                                .addField('Channel', `${interaction.channel}`)
                                .addField('Locked by', `${interaction.user}`)
                                .addField(`Reason`, `${reason}`)
                                .addField(`Duration`, `${duration}`)
                                .setTimestamp();
                            logChannel.send({ embeds: [embed] });
                        } else {
                            return;
                        }
                    } else {
                        interaction.reply({ embeds: [invalidTime] });
                    }
                } else if (channel) {
                    if (ms(duration)) {
                        if (channel.type !== "GUILD_TEXT") {
                            return interaction.reply({ embeds: [noValidChannel] });
                        }
                        channel.permissionOverwrites.edit(mainRole, {
                            SEND_MESSAGES: false
                        });
                        channel.permissionOverwrites.edit(interaction.guild.id, {
                            SEND_MESSAGES: false
                        });
                        const lockedChannelEmbed = new discord.MessageEmbed()
                            .setTitle(":lock: Channel Temporarily Locked!")
                            .addField("Channel", `${channel}`)
                            .addField(`Reason`, `${reason}`)
                            .addField(`Duration`, `${duration}`)
                            .setColor(colors.COLOR)
                            .setTimestamp()
                        const lockedEmbed = new discord.MessageEmbed()
                            .setTitle(":lock: Channel Locked!")
                            .setDescription(`This channel was locked by ${interaction.user}.`)
                            .addField(`Reason`, `${reason}`)
                            .addField(`Duration`, `${duration}`)
                            .setColor(colors.COLOR)
                            .setTimestamp()
                        channel.send({ embeds: [lockedEmbed] });
                        interaction.reply({ embeds: [lockedChannelEmbed] })
                        setTimeout(function () {
                            channel.permissionOverwrites.edit(mainRole, {
                                SEND_MESSAGES: true
                            });
                            channel.permissionOverwrites.edit(interaction.guild.id, {
                                SEND_MESSAGES: true
                            });
                            const unlockedEmbed = new discord.MessageEmbed()
                                .setTitle(":unlock: Channel Unlocked!")
                                .setDescription(`This channel was automatically unlocked after ${duration}.`)
                                .setColor(colors.COLOR)
                                .setTimestamp()
                            channel.send({ embeds: [unlockedEmbed] });
                            if (guildDatabase.logEnabled === "true") {
                                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                                if (!logChannel) return;
                                const embed = new discord.MessageEmbed()
                                    .setColor(colors.CLEAR_COLOR)
                                    .setTitle('Channel Auto Unlocked')
                                    .addField('Channel', `${channel}`)
                                    .addField('Locked by', `${interaction.user}`)
                                    .addField(`Reason`, `${reason}`)
                                    .addField(`Locked for`, `${duration}`)
                                    .setTimestamp();
                                logChannel.send({ embeds: [embed] });
                            } else {
                                return;
                            }
                        }, ms(duration));
                        if (guildDatabase.logEnabled === "true") {
                            const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                            if (!logChannel) return;
                            const embed = new discord.MessageEmbed()
                                .setColor(colors.CLEAR_COLOR)
                                .setTitle('Channel Locked')
                                .addField('Channel', `${channel}`)
                                .addField('Locked by', `${interaction.user}`)
                                .addField(`Reason`, `${reason}`)
                                .addField(`Duration`, `${duration}`)
                                .setTimestamp();
                            logChannel.send({ embeds: [embed] });
                        } else {
                            return;
                        }
                    } else {
                        interaction.reply({ embeds: [invalidTime] });
                    }
                } else {
                    interaction.reply({ embeds: [errorMain] });
                }
            } else {
                interaction.reply({ embeds: [errorMain] });
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}