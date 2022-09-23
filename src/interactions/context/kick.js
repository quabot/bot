const { ApplicationCommandType, EmbedBuilder, ContextMenuCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { getModerationConfig } = require("../../structures/functions/config");
const { generateEmbed } = require("../../structures/functions/embed");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Kick")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const modal = new ModalBuilder()
            .setTitle(`Kicking ${interaction.targetUser.tag}`)
            .setCustomId("kick-reason")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("reason")
                            .setLabel("Reason for kick")
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

            const reason = modalInteraction.fields.getTextInputValue("reason") ? modalInteraction.fields.getTextInputValue("reason") : "No reason specified.";
            const member = interaction.targetMember;
            const user = interaction.targetUser;
            let didKick = true;

            if (!user || !reason) {
                didKick = false;
                return modalInteraction.editReply({
                    embeds: [await generateEmbed(color, "Please enter both a user and the reason for kicking this user.")]
                }).catch((e => { }));
            }
    
            if (user.id === modalInteraction.user.id) {
                didKick = false;
                return modalInteraction.editReply({
                    embeds: [await generateEmbed(color, "**<:error:990996645913194517> What are you trying to do?**\nYou can't kick yourself!")]
                }).catch((e => { }));
            }
    
            if (member.roles.highest.rawPosition > modalInteraction.member.roles.highest.rawPosition) {
                didKick = false;
                return modalInteraction.editReply({
                    embeds: [await generateEmbed(color, "**<:error:990996645913194517> Insufficient permissions**\nYou cannot kick a user with roles higher than your own.")]
                }).catch((e => { }));
            }
    
            const modConfig = await getModerationConfig(client, modalInteraction.guild.id);
            if (!modConfig) {
                didKick = false;
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
    
            const kickId = PunishmentId ? PunishmentId.kickId + 1 : 1;
    
            await member.kick({ reason: reason }).catch(err => {
                didKick = false;
                if (err.code === 50013) return modalInteraction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("<:error:990996645913194517> Insufficient permissions")
                            .setDescription(`QuaBot does not have permission to kick that user - try moving the QuaBot role above all others`)
                            .setColor(color)
                    ],
                }).catch((e => { }));
            });
    
            if (didKick !== true) return;
    
            member.send({
                embeds: [await generateEmbed(color, `You were kicked from **${modalInteraction.guild.name}**
                **Kicked by**: ${modalInteraction.user}
                **Reason**: ${reason}`)
                    .setTitle("You were kicked!")
                    .setTimestamp()
                ]
            }).catch((e => { }));
    
            await modalInteraction.editReply({
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
                ], fetchReply: true
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
                                { name: "Kicked By", value: `${modalInteraction.user}`, inline: true },
                                { name: "Kicked In", value: `${modalInteraction.channel}`, inline: true },
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
                type: "kick",
                punishmentId: kickId,
                channelId: modalInteraction.channel.id,
                userExecuteId: modalInteraction.user.id,
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
}