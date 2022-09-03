const { ApplicationCommandOptionType, Interaction, Client, EmbedBuilder, PermissionFlagsBits, MembershipScreeningFieldType } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');
const { getModerationConfig } = require('../../../structures/functions/config');
const ms = require('ms');
const { tempUnban } = require('../../../structures/functions/guilds');

module.exports = {
    name: "tempban",
    description: "Temporarily ban a user.",
    permission: PermissionFlagsBits.KickMembers,
    options: [
        {
            name: "user",
            description: "User to tempban.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "duration",
            description: "How long to tempban. (1h, 10min)",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "reason",
            description: "Reason for temporarily banning the user.",
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
        let didBan = true;

        if (!user || !reason || !duration) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Please enter both a user, duration and the reason for banning this user.")]
            }).catch(() => null);
        }

        if (user.id === interaction.user.id) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> What are you trying to do?**\nYou can't ban yourself!")]
            }).catch(() => null);
        }

        if (!ms(duration)) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Please enter a valid duration. 1h, 30min, 1d")]
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
            }).catch((err => { }));
        });

        if (didBan !== true) return;

        if (!ephemeral) member.send({
            embeds: [await generateEmbed(color, `You were tempbanned from **${interaction.guild.name}**
            **Banned by**: ${interaction.user}
            **Duration**: ${duration}
            **Reason**: ${reason}`)
                .setTitle("You were tempbanned!")
                .setTimestamp()
            ]
        }).catch(() => null);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`User Tempbanned`)
                    .setDescription(`**User**: ${member}`)
                    .setColor(color)
                    .addFields(
                        { name: "Ban-ID", value: `${banId}`, inline: true },
                        { name: "Reason", value: `${reason}`, inline: true },
                        { name: "Duration", value: `${duration}`, inline: true },
                        { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                        { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                        { name: "Unbanned In", value: `<t:${(new Date().getTime() + ms(duration)) / 1000}:R>`, inline: true },
                    )
            ], ephemeral, fetchReply: true
        }).catch(() => null);

        if (channel) {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("User Tempbanned")
                        .setDescription(`**User**: ${member}`)
                        .setColor(color)
                        .addFields(
                            { name: "Ban-ID", value: `${banId}`, inline: true },
                            { name: "Reason", value: `${reason}`, inline: true },
                            { name: "Duration", value: `${duration}`, inline: true },
                            { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Banned By", value: `${interaction.user}`, inline: true },
                            { name: "Banned In", value: `${interaction.channel}`, inline: true },
                            { name: "Unbanned In", value: `<t:${(new Date().getTime() + ms(duration)) / 1000}:R>`, inline: true },
                        )
                        .setColor(color)
                ],
            }).catch(() => null);
        }

        const Temp = require('../../../structures/schemas/TempbanSchema');
        const newTemp = new Temp({
            guildId: interaction.guildId,
            userId: user.id,
            unbanTime: new Date().getTime() + ms(duration),
            banId: banId,
            channelId: interaction.channelId,
            banDuration: duration,
        });
        newTemp.save();

        setTimeout(async () => {
            await tempUnban(client, newTemp, color);
        }, ms(duration));

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