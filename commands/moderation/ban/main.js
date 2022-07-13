const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ban",
    description: 'Ban a user.',
    permission: "BAN_MEMBERS",
    permissions: ["SEND_MESSAGES", "BAN_MEMBERS"],
    options: [
        {
            name: "user",
            description: "Who should QuaBot ban?",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Why should that user be banned?",
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
        let didBan = true;

        if (!member) {
            didBan = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`**<:error:990996645913194517> Unspecified argument**\nPlease specify a user to ban`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (member.id === interaction.member.id) {
            didBan = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`**<:error:990996645913194517> What are you trying to do?**\nYou can't ban yourself!`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            didBan = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`**<:error:990996645913194517> Insufficcient permissions**\nYou cannot ban a user with roles higher than your own`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (member.roles.highest.rawPosition > interaction.guild.members.cache.get(client.user.id).roles.highest.rawPosition) {
            didBan = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`**<:error:990996645913194517> Insufficcient permissions**\nQuaBot does not have permission to ban that user - try moving the QuaBot role above all others`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        // if member has admin return;
        // if member = bot return;

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
            didBan = false;
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
                new MessageEmbed()
                    .setDescription(`We just created a new database record! Please run that command again :)`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        const banId = PunishmentIdDatabase.banId ? PunishmentIdDatabase.banId + 1 : 1;

        if (didBan) {
            if (!private) {
                member.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`You were banned!`)
                            .setDescription(`You were banned from **${interaction.guild.name}**
                    **Banned by**: ${interaction.user}
                    **Reason**: ${reason}`)
                            .setTimestamp()
                            .setColor(color)
                    ]
                }).catch(err => { });
            }
            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`User banned`)
                        .setDescription(`**User**: ${member}`)
                        .setColor(color)
                        .addFields(
                            { name: "Ban-ID", value: `${banId}`, inline: true },
                            { name: "Reason", value: `${reason}`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                        )
                ], ephemeral: private, fetchReply: true
            }).catch((err => { }))
        }

        member.ban({ reason: reason }).catch(err => {
            didBan = false;
            if (err.code === 50013) {
                interaction.deleteReply();
                return interaction.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("<:error:990996645913194517> Insufficcient permissions")
                            .setDescription(`QuaBot does not have permission to ban that user - try moving the QuaBot role above all others`)
                            .setColor(color)
                    ], ephemeral: private
                }).catch((err => { }))
            }
        });

        const channel = interaction.guild.channels.cache.get(`${ChannelDatabase.punishmentChannelId}`);
        if (channel) {
            if (didBan) {
                channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Member Banned")
                            .setDescription(`**User**: ${member}`)
                            .setColor(color)
                            .addFields(
                                { name: "Ban-ID", value: `${banId}`, inline: true },
                                { name: "Reason", value: `${reason}`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                                { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                                { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                                { name: "Banned By", value: `${interaction.user}`, inline: true },
                                { name: "Banned In", value: `${interaction.channel}`, inline: true },
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
            userId: interaction.user.id,
            type: "ban",
            punishmentId: banId,
            channelId: interaction.channel.id,
            userExecuteId: interaction.user.id,
            reason: reason,
            time: new Date().getTime(),
        });
        newPunishment.save();

        await PunishmentIdDatabase.updateOne({
            banId: banId,
        });

    }
}