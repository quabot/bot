const { ApplicationCommandType, ContextMenuCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { getModerationConfig } = require("../../structures/functions/config");
const { generateEmbed } = require("../../structures/functions/embed");
const ms = require('ms');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Timeout")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers | PermissionFlagsBits.ModerateMembers)
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const modal = new ModalBuilder()
            .setTitle(`Timeout ${interaction.targetUser.tag}`)
            .setCustomId("timeout-reason-and-duration")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("duration")
                            .setLabel("Duration of timeout")
                            .setMaxLength(200)
                            .setPlaceholder("eg. 1h, 30min, 1w")
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("reason")
                            .setLabel("Reason for ban")
                            .setMaxLength(200)
                            .setPlaceholder("Reason...")
                            .setRequired(false)
                            .setStyle(TextInputStyle.Paragraph)
                    )
            );

        await interaction.showModal(modal).catch(console.log);

        const modalInteraction = await interaction.awaitModalSubmit({
            time: 180000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modalInteraction) {

            await modalInteraction.deferReply({ ephemeral: false }).catch((e => { }));

            const member = interaction.targetMember;
            const user = interaction.targetUser;
            const duration = modalInteraction.fields.getTextInputValue("duration");
            const reason = modalInteraction.fields.getTextInputValue("reason") ? modalInteraction.fields.getTextInputValue("reason") : "No reason specified.";
            let didTimeout = true;

            if (!user || !reason) {
                didTimeout = false;
                return modalInteraction.editReply({
                    embeds: [await generateEmbed(color, "Please enter both a user and the reason for timing out this user.")]
                }).catch((e => { }));
            }
    
            if (!ms(duration)) {
                didTimeout = false;
                return modalInteraction.editReply({
                    embeds: [await generateEmbed(color, "Please enter a valid duration. (1h, 10min)")]
                }).catch((e => { }));
            }
    
            if (user.id === modalInteraction.user.id) {
                didTimeout = false;
                return modalInteraction.editReply({
                    embeds: [await generateEmbed(color, "**<:error:990996645913194517> What are you trying to do?**\nYou can't timeout yourself!")]
                }).catch((e => { }));
            }
    
            if (member.roles.highest.rawPosition > modalInteraction.member.roles.highest.rawPosition) {
                didTimeout = false;
                return modalInteraction.editReply({
                    embeds: [await generateEmbed(color, "**<:error:990996645913194517> Insufficient permissions**\nYou cannot timeout a user with roles higher than your own.")]
                }).catch((e => { }));
            }
    
            const modConfig = await getModerationConfig(client, modalInteraction.guild.id);
            if (!modConfig) {
                didTimeout = false;
                return modalInteraction.editReply({
                    embeds: [await generateEmbed(color, "We just created a new config! Please run that command again.")]
                }).catch((e => { }));
            }
    
            const channel = modalInteraction.guild.channels.cache.get(modConfig.channelId);
    
            const Punishment = require('../../structures/schemas/PunishmentSchema');
            const PunishmentId = await Punishment.findOne({
                guildId: modalInteraction.guildId,
                userId: user.id,
            }, (err, punishments) => {
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
                    newPun.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            }).clone().catch(function (err) { });
    
            const timeoutId = PunishmentId ? PunishmentId.timeoutId + 1 : 1;
    
            await member.timeout(ms(duration), `${reason}`).catch(err => {
                didTimeout = false;
                if (err.code === 50013) return modalInteraction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("<:error:990996645913194517> Insufficient permissions")
                            .setDescription(`QuaBot does not have permission to timeout that user - try moving the QuaBot role above all others`)
                            .setColor(color)
                    ],
                }).catch((e => { }))
                return modalInteraction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("<:error:990996645913194517> Incorrect Configuration")
                            .setDescription(`You can only timeout a user for 27 days.`)
                            .setColor(color)
                    ],
                }).catch((e => { }))
            });
    
            if (didTimeout !== true) return;
    
            member.send({
                embeds: [await generateEmbed(color, `You were timed out on **${modalInteraction.guild.name}**
                **Warned by**: ${modalInteraction.user}
                **Duration**: ${duration}
                **Reason**: ${reason}`)
                    .setTitle("You were timed out!")
                    .setTimestamp()
                ]
            }).catch((e => { }));
    
            await modalInteraction.editReply({
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
                ], fetchReply: true
            }).catch((e => { }));
    
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
                                { name: "Timed Out By", value: `${modalInteraction.user}`, inline: true },
                                { name: "Timed Out In", value: `${modalInteraction.channel}`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                            )
                            .setColor(color)
                    ],
                }).catch((e => { }));
            }
    
            const ModAction = require('../../structures/schemas/ModActionSchema');
            const newAction = new ModAction({
                guildId: modalInteraction.guild.id,
                userId: member.user.id,
                type: "timeout",
                punishmentId: timeoutId,
                channelId: modalInteraction.channel.id,
                userExecuteId: modalInteraction.user.id,
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
}