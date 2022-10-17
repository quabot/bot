const {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');
const { getModerationConfig } = require('../../structures/functions/config');
const { generateEmbed } = require('../../structures/functions/embed');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Ban')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers)
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").Interaction} interaction
     */
    async execute(client, interaction, color) {
        const modal = new ModalBuilder()
            .setTitle(`Banning ${interaction.targetUser.tag}`)
            .setCustomId('ban-reason')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('reason')
                        .setLabel('Reason for ban')
                        .setMaxLength(200)
                        .setPlaceholder('Reason...')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Paragraph)
                )
            );

        await interaction.showModal(modal).catch(console.log);

        const modalInteraction = await interaction
            .awaitModalSubmit({
                time: 180000,
                filter: i => i.user.id === interaction.user.id,
            })
            .catch(e => {
                return null;
            });

        if (modalInteraction) {
            await modalInteraction.deferReply({ ephemeral: false }).catch(e => {});

            const reason = modalInteraction.fields.getTextInputValue('reason')
                ? modalInteraction.fields.getTextInputValue('reason')
                : 'No reason specified.';
            const member = interaction.targetMember;
            const user = interaction.targetUser;
            let didBan = true;

            if (!user || !reason) {
                didBan = false;
                return modalInteraction
                    .editReply({
                        embeds: [
                            await generateEmbed(
                                color,
                                'Please enter both a user and the reason for banning this user.'
                            ),
                        ],
                    })
                    .catch(e => {});
            }

            if (user.id === modalInteraction.user.id) {
                didBan = false;
                return modalInteraction
                    .editReply({
                        embeds: [
                            await generateEmbed(
                                color,
                                "**<:error:990996645913194517> What are you trying to do?**\nYou can't ban yourself!"
                            ),
                        ],
                    })
                    .catch(e => {});
            }

            if (member.roles.highest.rawPosition > modalInteraction.member.roles.highest.rawPosition) {
                didBan = false;
                return modalInteraction
                    .editReply({
                        embeds: [
                            await generateEmbed(
                                color,
                                '**<:error:990996645913194517> Insufficient permissions**\nYou cannot ban a user with roles higher than your own.'
                            ),
                        ],
                    })
                    .catch(e => {});
            }

            const modConfig = await getModerationConfig(client, modalInteraction.guild.id);
            if (!modConfig) {
                didBan = false;
                return modalInteraction
                    .editReply({
                        embeds: [
                            await generateEmbed(color, 'We just created a new config! Please run that command again.'),
                        ],
                    })
                    .catch(e => {});
            }

            const channel = modalInteraction.guild.channels.cache.get(modConfig.channelId);

            const Punishment = require('../../structures/schemas/PunishmentSchema');
            const PunishmentId = await Punishment.findOne(
                {
                    guildId: modalInteraction.guildId,
                    userId: user.id,
                },
                (err, punishments) => {
                    if (err) console.error(err);
                    if (!punishments) {
                        const newPun = new Punishment({
                            guildId: modalInteraction.guildId,
                            userId: user.id,
                            banId: 0,
                            kickId: 0,
                            timeoutId: 0,
                            warnId: 0,
                        });
                        newPun.save().catch(err => {
                            console.log(err);
                        });
                    }
                }
            )
                .clone()
                .catch(function (err) {});

            const banId = PunishmentId ? PunishmentId.banId + 1 : 1;

            await member.ban({ reason: reason }).catch(err => {
                didBan = false;
                if (err.code === 50013)
                    return modalInteraction
                        .editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('<:error:990996645913194517> Insufficient permissions')
                                    .setDescription(
                                        `QuaBot does not have permission to ban that user - try moving the QuaBot role above all others`
                                    )
                                    .setColor(color),
                            ],
                        })
                        .catch(e => {});
            });

            if (didBan !== true) return;

            member
                .send({
                    embeds: [
                        await generateEmbed(
                            color,
                            `You were banned from **${modalInteraction.guild.name}**
                **Banned by**: ${modalInteraction.user}
                **Reason**: ${reason}`
                        )
                            .setTitle('You were banned!')
                            .setTimestamp(),
                    ],
                })
                .catch(e => {});

            await modalInteraction
                .editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`User Banned`)
                            .setDescription(`**User**: ${member}`)
                            .setColor(color)
                            .addFields(
                                { name: 'Ban-ID', value: `${banId}`, inline: true },
                                { name: 'Reason', value: `${reason}`, inline: true },
                                {
                                    name: 'Joined Server',
                                    value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
                                    inline: true,
                                },
                                {
                                    name: 'Account Created',
                                    value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
                                    inline: true,
                                },
                                { name: '\u200b', value: '\u200b', inline: true }
                            ),
                    ],
                    fetchReply: true,
                })
                .catch(e => {});

            if (channel) {
                channel
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('User Banned')
                                .setDescription(`**User**: ${member}`)
                                .setColor(color)
                                .addFields(
                                    { name: 'Ban-ID', value: `${banId}`, inline: true },
                                    { name: 'Reason', value: `${reason}`, inline: true },
                                    { name: '\u200b', value: '\u200b', inline: true },
                                    {
                                        name: 'Joined Server',
                                        value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Account Created',
                                        value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
                                        inline: true,
                                    },
                                    { name: '\u200b', value: '\u200b', inline: true },
                                    { name: 'Banned By', value: `${modalInteraction.user}`, inline: true },
                                    { name: 'Banned In', value: `${modalInteraction.channel}`, inline: true },
                                    { name: '\u200b', value: '\u200b', inline: true }
                                )
                                .setColor(color),
                        ],
                    })
                    .catch(e => {});
            }

            const ModAction = require('../../structures/schemas/ModActionSchema');
            const newAction = new ModAction({
                guildId: modalInteraction.guild.id,
                userId: member.user.id,
                type: 'ban',
                punishmentId: banId,
                channelId: modalInteraction.channel.id,
                userExecuteId: modalInteraction.user.id,
                reason: reason,
                time: new Date().getTime(),
            });
            newAction.save();

            if (!PunishmentId) return;
            await PunishmentId.updateOne({
                banId,
            });
        }
    },
};
