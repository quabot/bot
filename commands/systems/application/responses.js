const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionOverwrites, Permissions, Message, MessageManager, DiscordAPIError, ButtonStyle, Colors, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "responses",
    command: "application",
    permission: PermissionFlagsBits.Administrator,
    permissions: [PermissionFlagsBits.SendMessages],
    async execute(client, interaction, color) {


        console.log("Hello!")
        const appId = interaction.options.getString("application_id").toLowerCase();
        const responseUser = interaction.options.getUser("response_user") ? interaction.options.getUser("response_user") : null;

        // Find the applications
        const Application = require('../../../structures/schemas/ApplicationSchema');
        const ApplicationDatabase = await Application.findOne({
            guildId: interaction.guild.id,
            applicationTextId: appId,
        }, (err, application) => {
            if (err) console.log(err);
            if (!application) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`Could not find that application. Please create one on our [dashboard](https://dashboard.quabot.net)`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));
            }
        }).clone().catch((err => { }));

        if (!ApplicationDatabase) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Could not find that application. Please create one on our [dashboard](https://dashboard.quabot.net)`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));
        }

        const ApplicationAnswer = require('../../../structures/schemas/ApplicationAnswerSchema');
        var fal;
        if (responseUser !== null) {
            fal = await ApplicationAnswer.find({
                applicationUserId: responseUser.id,
                guildId: interaction.guild.id,
                applicationTextId: appId
            }).clone().catch((err => { }));
        }
        else if (responseUser === null) {
            fal = await ApplicationAnswer.find({
                guildId: interaction.guild.id,
                applicationTextId: appId
            }).clone().catch((err => { }));
        }
        const foundUserList = fal;
        if (!foundUserList || foundUserList.length === 0) return interaction.reply({ content: 'Couldn\'t find any responses by that user for that application' });

        const backId = 'backMusic'
        const forwardId = 'forwardMusic'
        const approveId = 'approveResponse'
        const denyId = 'denyResponse'
        const backButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Back',
            emoji: '⬅️',
            customId: backId
        });
        const forwardButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Forward',
            emoji: '➡️',
            customId: forwardId
        });
        const approveButton = new ButtonBuilder({
            style: ButtonStyle.Success,
            label: 'Approve',
            emoji: '✅',
            customId: approveId
        });
        const denyButton = new ButtonBuilder({
            style: ButtonStyle.Danger,
            label: 'Deny',
            emoji: '❎',
            customId: denyId
        });

        var thisResponse = null;

        await interaction.deferReply({ ephemeral: true });

        const makeEmbed = async start => {
            const current = foundUserList.slice(start, start + 1)[0];
            current.applicationAnswers.sort((a, b) => {
                return a.question - b.question;
            });

            thisResponse = current;

            var byStatementMember = interaction.guild.members.cache.get(current.applicationUserId) ? interaction.guild.members.cache.get(current.applicationUserId)  : {user: null};
            var byStatementUser = byStatementMember.user ? byStatementMember.user : {user: null};
            var byStatement = responseUser !== null ? responseUser.tag : byStatementUser.username + "#" + byStatementUser.discriminator;

            return new EmbedBuilder({
                title: `[${current.applicationState.replace("PENDING", "Pending").replace("DENIED", "Denied").replace("APPROVED", "Approved")}] Response ${start + 1}/${foundUserList.length} by ${byStatement}`,
                color: Colors.Green,
                fields: await Promise.all(
                    current.applicationAnswers.map(async (answer, id) => {

                        if (!ApplicationDatabase.applicationItems[answer.question]) return {
                            name: `Error!`,
                            value: `The application was edited, unable to display this entry.`
                        }

                        return {
                            name: `${ApplicationDatabase.applicationItems[answer.question].question}`,
                            value: `${answer.value}`
                        }
                    })
                )
            });
        }

        const canFit = foundUserList.length <= 1
        const msg = await interaction.editReply({
            embeds: [await makeEmbed(0)],
            components: [
                new ActionRowBuilder({
                    components: [
                        ...(canFit ? [] : [forwardButton]),
                        ...(thisResponse.applicationState === "PENDING" ? [approveButton, denyButton] : []),
                    ]
                })
            ]
        }).catch((err => { }));
        if (canFit) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        let currentIndex = 0
        collector.on('collect', async interaction => {
            if (interaction.customId === approveId) {

                /* Clicked approve */
                thisResponse.applicationState = "APPROVED";

                const updateResponse = await ApplicationAnswer.findOne({
                    guildId: thisResponse.guildId,
                    applicationId: thisResponse.applicationId,
                }, (err, reponse) => {
                    if (err) console.log(err);
                }).clone().catch((err => { }));
                if (!updateResponse) return;

                await updateResponse.updateOne({
                    applicationState: "APPROVED"
                });

                const user = interaction.guild.members.cache.get(`${updateResponse.applicationUserId}`);
                if (user) {
                    user.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setTitle("Application Approved")
                                .setDescription(`Your application was approved.`)
                                .addFields(
                                    { name: "Applied for", value: `${updateResponse.applicationTextId}`, inline: true },
                                )
                                .setFooter({ text: `${updateResponse.applicationId}` })
                        ],
                    }).catch((err => { }));
                }

                const role = interaction.guild.roles.cache.get(`${ApplicationDatabase.applicationReward}`);
                if (role) interaction.member.roles.add(`${ApplicationDatabase.applicationReward}`);

            } else if (interaction.customId === denyId) {

                /* Clicked deny */
                thisResponse.applicationState = "DENIED";

                const updateResponse = await ApplicationAnswer.findOne({
                    guildId: thisResponse.guildId,
                    applicationId: thisResponse.applicationId,
                }, (err, reponse) => {
                    if (err) console.log(err);
                }).clone().catch((err => { }));
                if (!updateResponse) return;

                await updateResponse.updateOne({
                    applicationState: "DENIED"
                });

                const user = interaction.guild.members.cache.get(`${updateResponse.applicationUserId}`);
                if (user) {
                    user.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setTitle("Application Denied")
                                .setDescription(`Your application was denied.`)
                                .addFields(
                                    { name: "Applied for", value: `${updateResponse.applicationTextId}`, inline: true },
                                )
                                .setFooter({ text: `${updateResponse.applicationId}` })
                        ],
                    }).catch((err => { }));
                }

            } else {
                /* Clicked forwards or backwards */
                interaction.customId === backId ? (currentIndex -= 1) : (currentIndex += 1)
            }
            await interaction.update({
                embeds: [await makeEmbed(currentIndex)],
                components: [
                    new ActionRowBuilder({
                        components: [
                            ...(currentIndex ? [backButton] : []),
                            ...(currentIndex + 1 < foundUserList.length ? [forwardButton] : []),
                            ...(thisResponse.applicationState === "PENDING" ? [approveButton, denyButton] : []),
                        ]
                    })
                ]
            }).catch((err => { }));
        });
    }
}
