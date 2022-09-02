const { ApplicationCommandOptionType, Interaction, Client, EmbedBuilder, PermissionFlagsBits, MembershipScreeningFieldType } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');
const { getModerationConfig } = require('../../../structures/functions/config');
const ms = require('ms');

module.exports = {
    name: "timeout",
    description: "Timeout a user.",
    permission: PermissionFlagsBits.ModerateMembers,
    options: [
        {
            name: "user",
            description: "User to timeout",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "duration",
            description: "Duration to timeout the user.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "reason",
            description: "Reason for timeout.",
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
        const duration = interaction.options.getString("duration");
        const reason = interaction.options.getString("reason") ? interaction.options.getString("reason").slice(0, 800) : "No reason specified.";
        let didTimeout = true;

        if (!user || !reason) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Please enter both a user and the reason for timing out this user.")]
            }).catch(() => null);
        }

        if (!ms(duration)) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Please enter a valid duration. (1h, 10min)")]
            }).catch(() => null);
        }

        if (user.id === interaction.user.id) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> What are you trying to do?**\nYou can't timeout yourself!")]
            }).catch(() => null);
        }

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> Insufficient permissions**\nYou cannot timeout a user with roles higher than your own.")]
            }).catch(() => null);
        }

        const modConfig = await getModerationConfig(client, interaction.guild.id);
        if (!modConfig) {
            didTimeout = false;
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

        const timeoutId = PunishmentId ? PunishmentId.timeoutId + 1 : 1;

        await member.timeout(ms(duration), `${reason}`).catch(err => {
            didTimeout = false;
            if (err.code === 50013) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("<:error:990996645913194517> Insufficient permissions")
                        .setDescription(`QuaBot does not have permission to timeout that user - try moving the QuaBot role above all others`)
                        .setColor(color)
                ], ephemeral
            }).catch((err => { }))
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("<:error:990996645913194517> Incorrect Configuration")
                        .setDescription(`You can only timeout a user for 27 days.`)
                        .setColor(color)
                ], ephemeral
            }).catch((err => { }))
        });

        if (didTimeout !== true) return;

        if (!ephemeral) member.send({
            embeds: [await generateEmbed(color, `You were timed out on **${interaction.guild.name}**
            **Warned by**: ${interaction.user}
            **Duration**: ${duration}
            **Reason**: ${reason}`)
                .setTitle("You were timed out!")
                .setTimestamp()
            ]
        }).catch(() => null);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`User Timed Out`)
                    .setDescription(`**User**: ${member}`)
                    .setColor(color)
                    .addFields(
                        { name: "Timeout-ID", value: `${timeoutId}`, inline: true },
                        { name: "Reason", value: `${reason}`, inline: true },
                        { name: "Duration", value: `${duration}`, inline: true },
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
                        .setTitle("Member Timed Out")
                        .setDescription(`**User**: ${member}`)
                        .setColor(color)
                        .addFields(
                            { name: "Timeout-ID", value: `${timeoutId}`, inline: true },
                            { name: "Reason", value: `${reason}`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Timed Out By", value: `${interaction.user}`, inline: true },
                            { name: "Timed Out In", value: `${interaction.channel}`, inline: true },
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
            type: "timeout",
            punishmentId: timeoutId,
            channelId: interaction.channel.id,
            userExecuteId: interaction.user.id,
            reason: reason,
            time: new Date().getTime(),
        });
        newAction.save();

        if (!PunishmentId) return;
        await PunishmentId.updateOne({
            timeoutId,
        });

    }
}