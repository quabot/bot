const { ApplicationCommandType, ContextMenuCommandInteraction, EmbedBuilder, ContextMenuCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require("discord.js");
const { generateEmbed } = require("../../structures/functions/embed");
const { getModerationConfig } = require("../../structures/functions/config");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Warn")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers | PermissionFlagsBits.ModerateMembers)
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {


        const modal = new ModalBuilder()
            .setTitle(`Warning ${interaction.targetUser.tag}`)
            .setCustomId("warn-reason")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("reason")
                            .setLabel("Reason for warning")
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

            if (!user || !reason) return modalInteraction.editReply({
                embeds: [await generateEmbed(color, "Please enter both a user and the reason for warning this user.")]
            }).catch((e => console.log(e)));

            if (user.id === modalInteraction.user.id) return modalInteraction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> What are you trying to do?**\nYou can't warn yourself!")]
            }).catch((e => console.log(e)));

            if (member.roles.highest.rawPosition > modalInteraction.member.roles.highest.rawPosition) return modalInteraction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> Insufficient permissions**\nYou cannot warn a user with roles higher than your own.")]
            }).catch((e => console.log(e)));

            const modConfig = await getModerationConfig(client, modalInteraction.guild.id);

            if (!modConfig) return modalInteraction.editReply({
                embeds: [await generateEmbed(color, "We just created a new config! Please run that command again.")]
            }).catch((e => { }));

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

            const warnId = PunishmentId ? PunishmentId.warnId + 1 : 1;

            member.send({
                embeds: [await generateEmbed(color, `You were warned on **${modalInteraction.guild.name}**
                        **Warned by**: ${modalInteraction.user}
                        **Reason**: ${reason}`)
                    .setTitle("You were warned!")
                    .setTimestamp()
                ]
            }).catch((e => { }));

            await modalInteraction.editReply({
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
                ],
            }).catch((e => console.log(e)));

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
                                { name: "Warned By", value: `${modalInteraction.user}`, inline: true },
                                { name: "Warned In", value: `${modalInteraction.channel}`, inline: true },
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
                type: "warn",
                punishmentId: warnId,
                channelId: modalInteraction.channel.id,
                userExecuteId: modalInteraction.user.id,
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
}