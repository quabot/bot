const { ApplicationCommandOptionType, Interaction, Client, EmbedBuilder, PermissionFlagsBits, MembershipScreeningFieldType } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');
const { getModerationConfig } = require('../../../structures/functions/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers | PermissionFlagBits.KickMembers | PermissionFlagsBits.ModerateMembers)
        .setDescription('Warn a user.')
        .addUserOption(option => option.setName("user").setDescription("User to warn.").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Reason for warning this user.").setRequired(true))
        .addBooleanOption(option => option.setName("private").setDescription("Do you want the punishment to be only visible to you?.").setRequired(false))
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const ephemeral = interaction.options.getBoolean("private") ? true : false;

        await interaction.deferReply({ ephemeral }).catch((e => { }));

        const member = interaction.options.getMember("user");
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason").slice(0, 800);

        if (!user || !reason) return interaction.editReply({
            embeds: [await generateEmbed(color, "Please enter both a user and the reason for timeout-ing this user.")]
        }).catch((e => { }));

        if (user.id === interaction.user.id) return interaction.editReply({
            embeds: [await generateEmbed(color, "**<:error:990996645913194517> What are you trying to do?**\nYou can't warn yourself!")]
        }).catch((e => { }));

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) return interaction.editReply({
            embeds: [await generateEmbed(color, "**<:error:990996645913194517> Insufficient permissions**\nYou cannot warn a user with roles higher than your own.")]
        }).catch((e => { }));

        const modConfig = await getModerationConfig(client, interaction.guild.id);
        if (!modConfig) return interaction.editReply({
            embeds: [await generateEmbed(color, "We just created a new config! Please run that command again.")]
        }).catch((e => { }));

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

        const warnId = PunishmentId ? PunishmentId.warnId + 1 : 1;

        if (!ephemeral) member.send({
            embeds: [await generateEmbed(color, `You were warned on **${interaction.guild.name}**
            **Warned by**: ${interaction.user}
            **Reason**: ${reason}`)
                .setTitle("You were warned!")
                .setTimestamp()
            ]
        }).catch((e => { }));

        await interaction.editReply({
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
            ], ephemeral, fetchReply: true
        }).catch((e => { }));

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
            }).catch((e => { }));
        }

        const ModAction = require('../../../structures/schemas/ModActionSchema');
        const newAction = new ModAction({
            guildId: interaction.guild.id,
            userId: member.user.id,
            type: "warn",
            punishmentId: warnId,
            channelId: interaction.channel.id,
            userExecuteId: interaction.user.id,
            reason: reason,
            time: new Date().getTime(),
        });
        newAction.save();

        if (!PunishmentId) return;
        await PunishmentId.updateOne({
            warnId: warnId,
        });

    }
}