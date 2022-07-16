const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "timeout",
    description: "Timeout/mute a user.",
    options: [
        {
            name: "user",
            description: "The user to timeout.",
            type: "USER",
            required: true
        },
        {
            name: "duration",
            description: "The duration to timeout.",
            type: "STRING",
            required: true
        },
        {
            name: "reason",
            description: "The reason for timeout.",
            type: "STRING",
            required: false
        },
        {
            name: "private",
            description: "Should the timeout be announced?",
            type: "BOOLEAN",
            required: false
        }
    ],
    async execute(client, interaction, color) {

        const user = interaction.options.getMember("user");
        const duration = interaction.options.getString("duration");
        const reason = interaction.options.getString("reason") ? interaction.options.getString("reason") : "No reason specified";
        const private = interaction.options.getBoolean("private") ? interaction.options.getBoolean("private") : false;
        let didTimeout = true;

        if (!user) {
            didTimeout = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`**<:error:990996645913194517> Unspecified argument**\nPlease specify a user to timeout.`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (user.id === interaction.user.id) {
            didTimeout = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`**<:error:990996645913194517> What are you trying to do?**\nYou can't timeout yourself!`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (user.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            didTimeout = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`**<:error:990996645913194517> Insufficcient permissions**\nYou cannot timeout a user with roles higher than your own.`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (user.roles.highest.rawPosition > interaction.guild.members.cache.get(client.user.id).roles.highest.rawPosition) {
            didTimeout = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<:error:990996645913194517> Insufficcient permissions")
                        .setDescription(`QuaBot does not have permission to timeout that user - try moving the QuaBot role above all others.`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (!ms(duration)) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Please give a valid time! Eg. \`1h, 20s\``)
                    .setColor(color)
            ], ephemeral: private
        }).catch((err => { }))


        const Channel = require('../../../structures/schemas/ChannelSchema');
        const ChannelDatabase = await Channel.findOne({
            guildId: interaction.guild.id,
        }, (err, channel) => {
            if (err) console.log(err);
            if (!channel) {
                const newChannel = new Channel({
                    guildId: interaction.guild.id,
                    punishmentChannelId: "none",
                });
                newChannel.save();
            }
        }).clone().catch((err => { }));

        if (!ChannelDatabase) {
            didKick = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`We just created a new database record! Please run that command again :)`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));
        }

        const PunishmentId = require('../../../structures/schemas/PunishmentIdSchema');
        const PunishmentIdDatabase = await PunishmentId.findOne({
            guildId: interaction.guild.id,
            userId: user.id,
        }, (err, channel) => {
            if (err) console.log(err);
            if (!channel) {
                const newPunishmentId = new PunishmentId({
                    guildId: interaction.guild.id,
                    userId: user.id,
                    warnId: 0,
                    kickId: 0,
                    banId: 0,
                    timeoutId: 1,
                });
                newPunishmentId.save();
            }
        }).clone().catch((err => { }));

        if (!PunishmentIdDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`We just created a new database record! Please run that command again :)`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));


        const timeoutId = PunishmentIdDatabase.timeoutId ? PunishmentIdDatabase.timeoutId + 1 : 1;

        await user.timeout(ms(duration), `${reason}`).catch(err => {
            didTimeout = false;
            if (err.code === 50013) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<:error:990996645913194517> Insufficcient permissions")
                        .setDescription(`QuaBot does not have permission to timeout that user - try moving the QuaBot role above all others`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        });

        if (didTimeout) {
            if (!private) {
                user.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`You were timed-out`)
                            .setDescription(`You were Timed-out on **${interaction.guild.name}**
                    **Timed-out by**: ${interaction.user}
                    **Reason**: ${reason}
                    **Duration**: ${duration}`)
                            .setTimestamp()
                            .setColor(color)
                    ]
                }).catch(err => { });
            }
            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`User Timed-Out`)
                        .setDescription(`**User**: ${user}`)
                        .setColor(color)
                        .addFields(
                            { name: "Timeout-ID", value: `${timeoutId}`, inline: true },
                            { name: "Reason", value: `${reason}`, inline: true },
                            { name: "Duration", value: `${duration}`, inline: true },
                            { name: "Joined Server", value: `<t:${parseInt(user.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Account Created", value: `<t:${parseInt(user.user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                        )
                ], ephemeral: private, fetchReply: true
            }).catch((err => { }));
        }

        const channel = interaction.guild.channels.cache.get(`${ChannelDatabase.punishmentChannelId}`);
        if (channel) {
            if (didTimeout) {
                channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("User Timed-Out")
                            .setDescription(`**User**: ${user}`)
                            .setColor(color)
                            .addFields(
                                { name: "Timeout-ID", value: `${timeoutId}`, inline: true },
                                { name: "Reason", value: `${reason}`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                                { name: "Joined Server", value: `<t:${parseInt(user.joinedTimestamp / 1000)}:R>`, inline: true },
                                { name: "Account Created", value: `<t:${parseInt(user.user.createdTimestamp / 1000)}:R>`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                                { name: "Timed-out By", value: `${interaction.user}`, inline: true },
                                { name: "Timed-out In", value: `${interaction.channel}`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                            )
                            .setColor(color)
                    ],
                }).catch((err => { }));
            }
        }

        const Punishment = require('../../../structures/schemas/PunishmentSchema');
        const newPunishment = new Punishment({
            guildId: interaction.guild.id,
            userId: user.user.id,
            type: "timeout",
            punishmentId: timeoutId,
            channelId: interaction.channel.id,
            userExecuteId: interaction.user.id,
            reason: reason,
            time: new Date().getTime(),
        });
        newPunishment.save();

        await PunishmentIdDatabase.updateOne({
            timeoutId,
        });
    }
}
