// ! add permissions for subcmds (answers, approve & deny)
// ! Required perms: ADMIN

const { MessageEmbed, MessageActionRow, MessageButton, PermissionOverwrites, Permissions, Message, MessageManager, DiscordAPIError } = require('discord.js');

// ! Required perms: ADMIN
module.exports = {
    name: "responses",
    command: "application",
    async execute(client, interaction, color) {

        const appId = interaction.options.getString("application_id");
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
                        new MessageEmbed()
                            .setDescription(`Could not find that application. Please create one on our [dashboard](https://dashboard.quabot.net)`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));
            }
        }).clone().catch((err => { }));

        if (!ApplicationDatabase) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Could not find that application. Please create one on our [dashboard](https://dashboard.quabot.net)`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));
        }

        const questions = ApplicationDatabase.applicationItems;
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
        const foundUserList = await fal;
        if (!foundUserList || foundUserList.length === 0) return interaction.reply({ content: 'Couldn\'t find any responses by that user for that application' });

        const backId = 'backMusic'
        const forwardId = 'forwardMusic'
        const approveId = 'approveResponse'
        const denyId = 'denyResponse'
        const backButton = new MessageButton({
            style: 'SECONDARY',
            label: 'Back',
            emoji: '⬅️',
            customId: backId
        });
        const forwardButton = new MessageButton({
            style: 'SECONDARY',
            label: 'Forward',
            emoji: '➡️',
            customId: forwardId
        });
        const approveButton = new MessageButton({
            style: 'SUCCESS',
            label: 'Approve',
            emoji: '✅',
            customId: approveId
        });
        const denyButton = new MessageButton({
            style: 'DANGER',
            label: 'Deny',
            emoji: '❎',
            customId: denyId
        });

        const { user, channel } = interaction;

        var thisResponse = null;

        await interaction.deferReply({ ephemeral: true });

        const makeEmbed = async start => {
            const current = foundUserList.slice(start, start + 1)[0];
            current.applicationAnswers.sort((a, b) => {
                return a.question - b.question;
            });

            console.log(ApplicationDatabase);

            thisResponse = current;

            console.log(interaction.guild.members.cache.get(current.applicationUserId).user);
            var byStatementUser = interaction.guild.members.cache.get(current.applicationUserId).user;
            var byStatement = responseUser !== null ? responseUser.tag : byStatementUser.username+"#"+byStatementUser.discriminator;

            return new MessageEmbed({
                title: `[${current.applicationState}] Response ${start + 1}/${foundUserList.length} by ${byStatement}`,
                color: color,
                fields: await Promise.all(
                    current.applicationAnswers.map(async (answer, id) => ({
                        name: `${ApplicationDatabase.applicationItems[answer.question].question}`,
                        value: `${answer.value}`
                    }))
                )
            });
        }

        const canFit = foundUserList.length <= 1
        const msg = await interaction.editReply({
            embeds: [await makeEmbed(0)],
            components: [
                new MessageActionRow({
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
                // do the same thing with ApplicationAnswers database, this only stores it in thisResponse.
            } else if (interaction.customId === denyId) {
                /* Clicked deny */
                thisResponse.applicationState = "DENIED";
                // do the same thing with ApplicationAnswers database, this only stores it in thisResponse.
            } else {
                /* Clicked forwards or backwards */
                interaction.customId === backId ? (currentIndex -= 1) : (currentIndex += 1)
            }
            await interaction.update({
                embeds: [await makeEmbed(currentIndex)],
                components: [
                    new MessageActionRow({
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