const { Interaction, Client, EmbedBuilder, PermissionFlagsBits, MembershipScreeningFieldType, SlashCommandBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');
const { getModerationConfig } = require('../../../structures/functions/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)
        .setDescription('Kick a user.')
        .addUserOption(option => option.setName("user").setDescription("User to kick.").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Reason for kicking the user.").setRequired(false))
        .addBooleanOption(option => option.setName("private").setDescription("Do you want the punishment to be only visible to you?.").setRequired(false))
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const ephemeral = interaction.options.getBoolean("private") ? interaction.options.getBoolean("private") : false;

        await interaction.deferReply({ ephemeral }).catch((e => { }));

        const member = interaction.options.getMember("user");
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") ? interaction.options.getString("reason").slice(0, 800) : "No reason specified.";
        let didKick = true;

        if (!user || !reason) {
            didKick = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Please enter both a user and the reason for kicking this user.")]
            }).catch((e => { }));
        }

        if (user.id === interaction.user.id) {
            didKick = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> What are you trying to do?**\nYou can't kick yourself!")]
            }).catch((e => { }));
        }

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            didKick = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> Insufficient permissions**\nYou cannot kick a user with roles higher than your own.")]
            }).catch((e => { }));
        }

        const modConfig = await getModerationConfig(client, interaction.guild.id);
        if (!modConfig) {
            didKick = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "We just created a new config! Please run that command again.")]
            }).catch((e => { }));
        }

        const channel = interaction.guild.channels.cache.get(modConfig.channelId);

        const Punishment = require('../../../structures/schemas/PunishmentSchema');
        const PunishmentId = await Punishment.findOne({
            guildId: interaction.guildId,
            userId: user.id,
        }, (err, punishments) => {
            if (err) console.error(err);
            if (!punishments) {
                const newPun = new Punishment({
                    guildId: interaction.guildId,
                    userId: user.id,
                    banId: 0,
                    kickId: 0,
                    timeoutId: 0,
                    warnId: 0,
                });
                newPun.save()
                    .catch(err => {
                        console.log(err);
                    });
            }
        }).clone().catch(function (err) { });

        const kickId = PunishmentId ? PunishmentId.kickId + 1 : 1;

        await member.kick({ reason: reason }).catch(err => {
            didKick = false;
            if (err.code === 50013) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("<:error:990996645913194517> Insufficient permissions")
                        .setDescription(`QuaBot does not have permission to kick that user - try moving the QuaBot role above all others`)
                        .setColor(color)
                ], ephemeral
            }).catch((e => { }))
        });

        if (didKick !== true) return;

        if (!ephemeral) member.send({
            embeds: [await generateEmbed(color, `You were kicked from **${interaction.guild.name}**
            **Kicked by**: ${interaction.user}
            **Reason**: ${reason}`)
                .setTitle("You were kicked!")
                .setTimestamp()
            ]
        }).catch((e => { }));

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`User Kicked`)
                    .setDescription(`**User**: ${member}`)
                    .setColor(color)
                    .addFields(
                        { name: "Kick-ID", value: `${kickId}`, inline: true },
                        { name: "Reason", value: `${reason}`, inline: true },
                        { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                        { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                        { name: "\u200b", value: "\u200b", inline: true },
                    )
            ], ephemeral, fetchReply: true
        }).catch((e => { }));

        if (channel) {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("User Kicked")
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
            }).catch((e => { }));
        }

        const ModAction = require('../../../structures/schemas/ModActionSchema');
        const newAction = new ModAction({
            guildId: interaction.guild.id,
            userId: member.user.id,
            type: "kick",
            punishmentId: kickId,
            channelId: interaction.channel.id,
            userExecuteId: interaction.user.id,
            reason: reason,
            time: new Date().getTime(),
        });
        newAction.save();

        if (!PunishmentId) return;
        await PunishmentId.updateOne({
            kickId,
        });

    }
}