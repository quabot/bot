const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "untimeout",
    description: "Timeout/mute a user.",
    options: [
        {
            name: "user",
            description: "The user to timeout.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "private",
            description: "Should the timeout be announced?",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],
    permission: PermissionFlagsBits.ModerateMembers,
    async execute(client, interaction, color) {

        const user = interaction.options.getMember("user");
        const private = interaction.options.getBoolean("private") ? interaction.options.getBoolean("private") : false;
        let didTimeout = true;

        if (!user) {
            didTimeout = false;
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**<:error:990996645913194517> Unspecified argument**\nPlease specify a user to remove a timeout from.`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (user.id === interaction.user.id) {
            didTimeout = false;
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**<:error:990996645913194517> What are you trying to do?**\nYou can't remove a timeout from yourself!`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (user.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            didTimeout = false;
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**<:error:990996645913194517> Insufficcient permissions**\nYou cannot remove a timeout from a user with roles higher than your own.`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (user.roles.highest.rawPosition > interaction.guild.members.cache.get(client.user.id).roles.highest.rawPosition) {
            didTimeout = false;
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("<:error:990996645913194517> Insufficcient permissions")
                        .setDescription(`QuaBot does not have permission to remove a timeout from that user - try moving the QuaBot role above all others.`)
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

        await user.timeout(1, `${interaction.user.tag} removed the timeout.`).catch(err => {
            didTimeout = false;
            if (err.code === 50013) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("<:error:990996645913194517> Insufficcient permissions")
                        .setDescription(`QuaBot does not have permission to remove a timeout from that user - try moving the QuaBot role above all others`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        });

        if (didTimeout) {
            if (!private) {
                user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Your timeout was removed`)
                            .setDescription(`Your timeout was removed on **${interaction.guild.name}**
                    **Removed by**: ${interaction.user}
                    `)
                            .setTimestamp()
                            .setColor(color)
                    ]
                }).catch(err => { });
            }
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`User Timeout Removed`)
                        .setDescription(`**User**: ${user}`)
                        .setColor(color)
                ], ephemeral: private, fetchReply: true
            }).catch((err => { }));
        }

        const channel = interaction.guild.channels.cache.get(`${ChannelDatabase.punishmentChannelId}`);
        if (channel) {
            if (didTimeout) {
                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`User Timeout Removed`)
                            .setDescription(`**User**: ${user}`)
                            .setColor(color)
                    ],
                }).catch((err => { }));
            }
        }
    }
}
