const { ButtonStyle, ButtonBuilder, ActionRowBuilder, Colors, PermissionFlagsBits, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { getVerifyConfig } = require("../../../structures/functions/config");
const { generateEmbed } = require("../../../structures/functions/embed");
const { randomString } = require("../../../structures/functions/strings");

module.exports = {
    id: "verify-server",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const verifyConfig = await getVerifyConfig(client, interaction.guildId);

        if (!verifyConfig) return interaction.reply({
            embeds: [await generateEmbed(color, "A config is being generated, please run the command again.")],
            ephemeral: true
        }).catch((err => { }));

        if (verifyConfig.verifyEnabled === false) return interaction.reply({
            embeds: [await generateEmbed(color, "Verifications are not enabled in this server.")],
            ephemeral: true
        }).catch((err => { }));

        const logChannel = interaction.guild.channels.cache.get(`${verifyConfig.logChannel}`);


        if (verifyConfig.verifyCode) {

            const code = await randomString();

            const modal = new ModalBuilder()
                .setTitle("Type the verification code.")
                .setCustomId("verify-code")
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId("code")
                                .setLabel("Code: " + code)
                                .setPlaceholder("Type the verification code. (Case sensitive)")
                                .setMaxLength(8)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                        )
                )

            await interaction.showModal(modal);

            const modalInteraction = await interaction.awaitModalSubmit({
                time: 60000,
                filter: i => i.user.id === interaction.user.id,
            }).catch(e => {
                return null
            });

            if (modalInteraction) {
                if (modalInteraction.customId !== 'verify-code') return;
                await modalInteraction.deferReply({ ephemeral: true }).catch((err => { }));

                const enteredCode = modalInteraction.fields.getTextInputValue("code");
                if (enteredCode !== code) return modalInteraction.editReply({
                    embeds: [await generateEmbed(color, "You entered the wrong code! Try again.")],
                    ephemeral: true
                }).catch((err => { }));


                verifyConfig.verifyRoles.forEach(role => {
                    if (role.bot && interaction.user.bot) {
                        const fRole = interaction.member.guild.roles.cache.get(role.id);
                        if (fRole) {
                            setTimeout(() => {
                                interaction.member.roles.add(fRole).catch((err => { }));
                            }, role.delay);
                        }
                    }

                    if (role.bot === false && !interaction.user.bot) {
                        const fRole = interaction.member.guild.roles.cache.get(role.id);
                        if (fRole) {
                            setTimeout(() => {
                                interaction.member.roles.add(fRole).catch((err => { }));
                            }, role.delay);
                        }
                    }
                });

                await modalInteraction.editReply({
                    embeds: [await generateEmbed(color, "You have been verified!")],
                    ephemeral: true
                }).catch((err => { }));

                if (verifyConfig.verifyLog && logChannel) logChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTitle("User Verified")
                            .setDescription(`${modalInteraction.user} has verified themselves.`)
                            .setTimestamp()
                    ]
                }).catch((err => { }));
            }
        } else {

            verifyConfig.verifyRoles.forEach(role => {
                if (role.bot && interaction.user.bot) {
                    const fRole = interaction.member.guild.roles.cache.get(role.id);
                    if (!fRole) return;
                    setTimeout(() => {
                        interaction.member.roles.add(fRole).catch((err => { }));
                    }, role.delay);
                }

                if (role.bot === false && !interaction.user.bot) {
                    const fRole = interaction.member.guild.roles.cache.get(role.id);
                    if (!fRole) return;
                    setTimeout(() => {
                        interaction.member.roles.add(fRole).catch((err => { }));
                    }, role.delay);
                }
            });

            await interaction.reply({
                embeds: [await generateEmbed(color, "You have been verified!")],
                ephemeral: true
            }).catch((err => { }));

            if (verifyConfig.verifyLog && logChannel) logChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle("User Verified")
                        .setDescription(`${interaction.user} has verified themselves.`)
                        .setTimestamp()
                ]
            }).catch((err => { }));
        }
    }
}