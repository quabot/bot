const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "kick",
    description: 'Kick a user.',
    permission: "KICK_MEMBERS",
    permissions: ["SEND_MESSAGES", "KICK_MEMBERS"],
    options: [
        {
            name: "user",
            description: "Who should QuaBot kick?",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Why should that user be kicked?",
            type: "STRING",
            required: false,
        },
        {
            name: "private",
            description: "Should QuaBot hide this command being performed?",
            type: "BOOLEAN",
            required: false,
        }
    ],
    async execute(client, interaction, color) {
        let member = interaction.options.getMember('user');
        let reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : "No reason given";
        let private = interaction.options.getBoolean('private') ? true : false;
        if (reason.length > 1000) reason = "No reason specified.";
        let didKick = true;

        if (!member) {
            didKick = false;
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**<:error:990996645913194517> Unspecified argument**\nPlease specify a user to kick`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (member.id === interaction.member.id) {
            didKick = false;
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**<:error:990996645913194517> What are you trying to do?**\nYou can't kick yourself!`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            didKick = false;
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`**<:error:990996645913194517> Insufficcient permissions**\nYou cannot kick a user with roles higher than your own`)
                    .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (member.roles.highest.rawPosition > interaction.guild.members.cache.get(client.user.id).roles.highest.rawPosition) {
            didKick = false;
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("<:error:990996645913194517> Insufficcient permissions")
                        .setDescription(`QuaBot does not have permission to kick that user - try moving the QuaBot role above all others`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

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
                    new EmbedBuilder()
                        .setDescription(`We just created a new database record! Please run that command again :)`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));
        }

        const PunishmentId = require('../../../structures/schemas/PunishmentIdSchema');
        const PunishmentIdDatabase = await PunishmentId.findOne({
            guildId: interaction.guild.id,
            userId: member.id,
        }, (err, channel) => {
            if (err) console.log(err);
            if (!channel) {
                const newPunishmentId = new PunishmentId({
                    guildId: interaction.guild.id,
                    userId: member.id,
                    warnId: 0,
                    kickId: 0,
                    banId: 1,
                    timeoutId: 0,
                });
                newPunishmentId.save();
            }
        }).clone().catch((err => { }));

        if (!PunishmentIdDatabase) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`We just created a new database record! Please run that command again :)`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        const kickId = PunishmentIdDatabase.kickId ? PunishmentIdDatabase.kickId + 1 : 1;

        await member.kick({ reason: reason }).catch(err => {
            didKick = false;
            if (err.code === 50013) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("<:error:990996645913194517> Insufficcient permissions")
                            .setDescription(`QuaBot does not have permission to kick that user - try moving the QuaBot role above all others`)
                            .setColor(color)
                    ], ephemeral: private
                }).catch((err => { }))
            }
        });

        if (didKick) {
            if (!private) {
                member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`You were kicked`)
                            .setDescription(`You were kicked from **${interaction.guild.name}**
                    **Kicked by**: ${interaction.user}
                    **Reason**: ${reason}`)
                            .setTimestamp()
                            .setColor(color)
                    ]
                }).catch(err => { });
            }
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`User kicked`)
                        .setDescription(`**User**: ${member}`)
                        .setColor(color)
                        .addFields(
                            { name: "Kick-ID", value: `${kickId}`, inline: true },
                            { name: "Reason", value: `${reason}`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                        )
                ], ephemeral: private, fetchReply: true
            }).catch((err => { }))
        }


        const channel = interaction.guild.channels.cache.get(`${ChannelDatabase.punishmentChannelId}`);
        if (channel) {
            if (didKick) {
                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Member Kicked")
                            .setDescription(`**User**: ${member}`)
                            .setColor(color)
                            .addFields(
                                { name: "Kick-ID", value: `${kickId}`, inline: true },
                                { name: "Reason", value: `${reason}`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                                { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                                { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                                { name: "Kicked By", value: `${interaction.user}`, inline: true },
                                { name: "Kicked In", value: `${interaction.channel}`, inline: true },
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
            userId: member.user.id,
            type: "kick",
            punishmentId: kickId,
            channelId: interaction.channel.id,
            userExecuteId: interaction.user.id,
            reason: reason,
            time: new Date().getTime(),
        });
        newPunishment.save();

        await PunishmentIdDatabase.updateOne({
            kickId: kickId,
        });
        
    }
}
