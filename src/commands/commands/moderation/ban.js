const { Interaction, Client, EmbedBuilder, PermissionFlagsBits, MembershipScreeningFieldType, SlashCommandBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');
const { getModerationConfig } = require('../../../structures/functions/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers)
        .setDescription('Ban a user.')
        .addUserOption(option => option.setName("user").setDescription("User to ban.").setRequired(true))
        .addIntegerOption(option => option.setName("delete_messages").setDescription("How many of their recent messages to delete.").setRequired(true).addChoices(
            { name: "Don't delete any", value: 0 },
            { name: "Previous hour", value: 3600 },
            { name: "Previous 6 hours", value: 21600 },
            { name: "Previous 12 hours", value: 43200 },
            { name: "Previous 24 hours", value: 86400 },
            { name: "Previous 3 days", value: 259200 },
            { name: "Previous 7 days", value: 604800 }
        ))
        .addStringOption(option => option.setName("reason").setDescription("Reason for banning the user.").setRequired(false))
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
        const seconds = interaction.options.getInteger("delete_messages");
        const reason = interaction.options.getString("reason") ? interaction.options.getString("reason").slice(0, 800) : "No reason specified.";
        let didBan = true;

        if (!user || !reason) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Please enter both a user and the reason for banning this user.")]
            }).catch((e => { }));
        }

        if (user.id === interaction.user.id) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> What are you trying to do?**\nYou can't ban yourself!")]
            }).catch((e => { }));
        }

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> Insufficient permissions**\nYou cannot ban a user with roles higher than your own.")]
            }).catch((e => { }));
        }

        const modConfig = await getModerationConfig(client, interaction.guild.id);
        if (!modConfig) {
            didBan = false;
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

        const banId = PunishmentId ? PunishmentId.banId + 1 : 1;

        await member.ban({ reason: reason, deleteMessageSeconds: seconds }).catch(err => {
            didBan = false;
            if (err.code === 50013) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("<:error:990996645913194517> Insufficient permissions")
                        .setDescription(`QuaBot does not have permission to ban that user - try moving the QuaBot role above all others`)
                        .setColor(color)
                ], ephemeral
            }).catch((e => { }));
        });

        if (didBan !== true) return;

        if (!ephemeral) member.send({
            embeds: [await generateEmbed(color, `You were banned from **${interaction.guild.name}**
            **Banned by**: ${interaction.user}
            **Reason**: ${reason}`)
                .setTitle("You were banned!")
                .setTimestamp()
            ]
        }).catch((e => { }));

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`User Banned`)
                    .setDescription(`**User**: ${member}`)
                    .setColor(color)
                    .addFields(
                        { name: "Ban-ID", value: `${banId}`, inline: true },
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
                        .setTitle("User Banned")
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
            }).catch((e => { }));
        }

        const ModAction = require('../../../structures/schemas/ModActionSchema');
        const newAction = new ModAction({
            guildId: interaction.guild.id,
            userId: member.user.id,
            type: "ban",
            punishmentId: banId,
            channelId: interaction.channel.id,
            userExecuteId: interaction.user.id,
            reason: reason,
            time: new Date().getTime(),
        });
        newAction.save();

        if (!PunishmentId) return;
        await PunishmentId.updateOne({
            banId,
        });

    }
}