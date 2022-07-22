const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "warn",
    description: 'Warn a user.',
    permission: PermissionFlagsBits.ModerateMembers,
    options: [
        {
            name: "user",
            description: "Who should QuaBot warn?",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "Why should that user be warned?",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "private",
            description: "Should QuaBot hide this command being performed?",
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        }
    ],
    async execute(client, interaction, color) {
        let member = interaction.options.getMember('user');
        let reason = interaction.options.getString('reason');
        let private = interaction.options.getBoolean('private') ? true : false;
        if (reason.length > 1000) reason = "No reason specified.";

        if (!member) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**<:error:990996645913194517> Unspecified argument**\nPlease specify a user to warn.`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (member.id === interaction.member.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**<:error:990996645913194517> What are you trying to do?**\nYou can't warn yourself!`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**<:error:990996645913194517> Insufficcient permissions**\nYou cannot warn a user with roles higher than your own.`)
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
                    warnId: 1,
                    kickId: 0,
                    banId: 0,
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

        const warnId = PunishmentIdDatabase.warnId ? PunishmentIdDatabase.warnId + 1 : 1;

        if (!private) {
            member.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`You were warned!`)
                        .setDescription(`You were warned on **${interaction.guild.name}**
                    **Warned by**: ${interaction.user}
                    **Reason**: ${reason}`)
                        .setTimestamp()
                        .setColor(color)
                ]
            }).catch(err => { });
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`User Warned`)
                    .setDescription(`**User**: ${member}`)
                    .setColor(color)
                    .addFields(
                        { name: "Warn-ID", value: `${warnId}`, inline: true },
                        { name: "Reason", value: `${reason}`, inline: true },
                        { name: "\u200b", value: "\u200b", inline: true },
                        { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                        { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                        { name: "\u200b", value: "\u200b", inline: true },
                    )
            ], ephemeral: private, fetchReply: true
        }).catch((err => { }))


        const channel = interaction.guild.channels.cache.get(`${ChannelDatabase.punishmentChannelId}`);
        if (channel) {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Member Warned")
                        .setDescription(`**User**: ${member}`)
                        .setColor(color)
                        .addFields(
                            { name: "Warn-ID", value: `${warnId}`, inline: true },
                            { name: "Reason", value: `${reason}`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Warned By", value: `${interaction.user}`, inline: true },
                            { name: "Warned In", value: `${interaction.channel}`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                        )
                        .setColor(color)
                ],
            }).catch((err => { }));
        }


        const Punishment = require('../../../structures/schemas/PunishmentSchema');
        const newPunishment = new Punishment({
            guildId: interaction.guild.id,
            userId: member.user.id,
            type: "warn",
            punishmentId: warnId,
            channelId: interaction.channel.id,
            userExecuteId: interaction.user.id,
            reason: reason,
            time: new Date().getTime(),
        });
        newPunishment.save();

        await PunishmentIdDatabase.updateOne({
            warnId: warnId,
        });

    }
}
