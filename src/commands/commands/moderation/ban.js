const { ApplicationCommandOptionType, Interaction, Client, EmbedBuilder, PermissionFlagsBits, MembershipScreeningFieldType } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');
const { getModerationConfig } = require('../../../structures/functions/config');

module.exports = {
    name: "ban",
    description: "Ban a user.",
    permission: PermissionFlagsBits.KickMembers,
    options: [
        {
            name: "user",
            description: "User to ban.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "reason",
            description: "Reason for banning the user.",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "private",
            description: "Do you want this punishment to only be visible to you?",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const ephemeral = interaction.options.getBoolean("private") ? interaction.options.getBoolean("private") : false;

        await interaction.deferReply({ ephemeral }).catch(() => null);

        const member = interaction.options.getMember("user");
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") ? interaction.options.getString("reason").slice(0, 800) : "No reason specified.";
        let didBan = true;

        if (!user || !reason) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Please enter both a user and the reason for banning this user.")]
            }).catch(() => null);
        }

        if (user.id === interaction.user.id) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> What are you trying to do?**\nYou can't ban yourself!")]
            }).catch(() => null);
        }

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> Insufficient permissions**\nYou cannot ban a user with roles higher than your own.")]
            }).catch(() => null);
        }

        const modConfig = await getModerationConfig(client, interaction.guild.id);
        if (!modConfig) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "We just created a new config! Please run that command again.")]
            }).catch(() => null);
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

        await member.ban({ reason: reason }).catch(err => {
            didBan = false;
            if (err.code === 50013) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("<:error:990996645913194517> Insufficient permissions")
                        .setDescription(`QuaBot does not have permission to ban that user - try moving the QuaBot role above all others`)
                        .setColor(color)
                ], ephemeral
            }).catch(() => null);
        });

        if (didBan !== true) return;

        if (!ephemeral) member.send({
            embeds: [await generateEmbed(color, `You were banned from **${interaction.guild.name}**
            **Banned by**: ${interaction.user}
            **Reason**: ${reason}`)
                .setTitle("You were banned!")
                .setTimestamp()
            ]
        }).catch(() => null);

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
        }).catch(() => null);

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
            }).catch(() => null);
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