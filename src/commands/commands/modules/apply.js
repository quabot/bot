const { PermissionFlagsBits, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextInputStyle, ModalBuilder, TextInputBuilder, SlashCommandBuilder } = require('discord.js');
const { getApplicationConfig } = require('../../../structures/functions/config');
const { generateEmbed } = require('../../../structures/functions/embed');
const Application = require('../../../structures/schemas/ApplicationSchema');
const { randomUUID } = require('node:crypto');
const ApplicationAnswer = require('../../../structures/schemas/ApplicationAnswerSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('apply')
        .setDescription('Apply for an application.')
        .setDMPermission(false)
        .addStringOption(option => option.setName("id").setRequired(true).setDescription("The id of the application to apply for.")),
    async execute(client, interaction, color) {


        const id = await interaction.options.getString("id").toLowerCase();
        const applicationConfig = await getApplicationConfig(client, interaction.guildId);

        if (!applicationConfig) return interaction.reply({
            embeds: [await generateEmbed(color, "We just generated a new config. Please run the command again.")]
        }).catch((e => { }));

        if (applicationConfig.applicationEnabled === false) return interaction.reply({
            embeds: [await generateEmbed(color, "Applications are not enabled in this server.")]
        }).catch((e => { }));



        const application = await Application.findOne({
            guildId: interaction.guildId,
            applicationId: id,
        });

        if (!application) return interaction.reply({
            embeds: [await generateEmbed(color, "Couldn't find that application.")]
        }).catch((e => { }));



        const answer = await ApplicationAnswer.findOne({
            guildId: interaction.guildId,
            userId: interaction.user.id,
        });

        if (answer && application.applicationReapply === false) interaction.reply({
            embeds: [await generateEmbed(color, "You can only apply for that application once.")]
        }).catch((e => { }));


        if (application.requiredPermission !== "none" && !interaction.member.permissions.has(application.requiredPermission)) return interaction.reply({
            embeds: [await generateEmbed(color, "You don't have the required permissions to apply for that application.")]
        }).catch((e => { }));


        // Make the buttons
        const backId = 'back-apply';
        const forwardId = 'forward-apply';
        const enterId = 'enter-apply';
        const editId = 'enter-apply';
        const submitId = 'submit-apply';
        const backButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Back',
            emoji: '◀️',
            customId: backId
        });
        const forwardButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Next',
            emoji: '▶️',
            customId: forwardId
        });
        const enterButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Respond',
            emoji: '📎',
            customId: enterId
        });
        const editButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Edit',
            emoji: '✏️',
            customId: editId
        });
        const submitButton = new ButtonBuilder({
            style: ButtonStyle.Success,
            label: 'Submit',
            emoji: '✅',
            customId: submitId
        });


        // The current question and the user's answers.
        let q = null;
        let currentAnswer = false;
        const answers = [];

        const makeEmbed = async start => {
            const current = application.applicationItems.slice(start, start + 1);

            return new EmbedBuilder({
                color: Colors.Green,
                timestamp: Date.now(),
                title: `Question ${start + 1}/${application.applicationItems.length}`,
                fields: await Promise.all(
                    current.map(async (item) => {

                        // set the current question (and the currentID)
                        q = item;
                        let currentIndexId = application.applicationItems.indexOf(item);

                        if (answers.find(item => item.question === currentIndexId)) {

                            const currentAnswer = answers.find(item => item.question === currentIndexId);

                            return (
                                {
                                    name: `**Question ${currentIndexId + 1}**`,
                                    value: `${item.question}\n\n**Your Answer**\n${currentAnswer.value}`.slice(0, 1024),
                                    inline: false
                                }
                            );

                        } else {

                            return ({
                                name: `**Question ${currentIndexId + 1}**`,
                                value: `${item.question}`,
                                inline: false
                            });

                        }
                    })
                )
            });
        }

        if (answers.find(item => item.question === currentIndexId)) currentAnswer = answers.find(item => item.question === currentIndexId);

        let currentIndex = 0;
        let currentIndexId = application.applicationItems.indexOf(currentIndex);
        const canFit = application.applicationItems.length <= 1;
        const msg = await interaction.reply({
            embeds: [await makeEmbed(0)],
            ephemeral: true,
            components: canFit
                ? [new ActionRowBuilder({ components: [currentAnswer ? editButton : enterButton, submitButton]})]
                : [new ActionRowBuilder({ components: [enterButton, forwardButton] })]
        }).catch((e => console.log(e)));
        if (!msg) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        collector.on('collect', async interaction => {

            // regular back and forward
            if (interaction.customId === backId || interaction.customId === forwardId) {
                interaction.customId === backId ? (currentIndex -= 1) : (currentIndex += 1)
                currentAnswer = answers.find(item => item.question === currentIndex);
                await interaction.update({
                    embeds: [await makeEmbed(currentIndex)],
                    components: [
                        new ActionRowBuilder({
                            components: [
                                currentAnswer ? editButton : enterButton,
                                ...(currentIndex + 1 === application.applicationItems.length ? [submitButton] : []),
                                ...(currentIndex ? [backButton] : []),
                                ...(currentIndex + 1 < application.applicationItems.length ? [forwardButton] : []),
                            ]
                        })
                    ]
                }).catch((e => { }));
            }

            // do a question
            if (interaction.customId === enterId) {

                const filter = (interaction) => interaction.customId === 'apply-question';
                interaction.awaitModalSubmit({ filter, time: 600000 })
                    .then(async interaction => {

                        if (answers.find(item => item.question === currentIndex)) {

                            for (var i = 0; i < answers.length; i++) {
                                if (answers[i].question === currentIndex) {
                                    answers.splice(i, 1);
                                    i--;
                                }
                            }

                            answers.push({
                                value: `${interaction.fields.getTextInputValue('answer')}`,
                                question: currentIndex
                            });

                        } else {

                            answers.push({
                                value: `${interaction.fields.getTextInputValue('answer')}`,
                                question: currentIndex
                            });

                        }

                        currentAnswer = answers.find(item => item.question === currentIndex);
                        await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`${interaction.message.embeds[0].title}`)
                                    .setColor(Colors.Green)
                                    .addFields(
                                        { name: `${interaction.message.embeds[0].fields[0].name}`, value: `${q.question}\n\n**Your Answer**\n${interaction.fields.getTextInputValue('answer')}`.slice(0, 1024) },
                                    )
                            ],
                            components: [
                                new ActionRowBuilder({
                                    components: [
                                        currentAnswer ? editButton : enterButton,
                                        ...(currentIndex + 1 === application.applicationItems.length ? [submitButton] : []),
                                        ...(currentIndex ? [backButton] : []),
                                        ...(currentIndex + 1 < application.applicationItems.length ? [forwardButton] : []),
                                    ]
                                })
                            ]
                        }).catch((e => { }));
                    });

                // Create the modal
                const type = q.type === "SHORT" ? TextInputStyle.Short : TextInputStyle.Paragraph;

                const value = answers.find(item => item.question === currentIndex) ? answers.find(item => item.question === currentIndex).value : "";
                const modal = new ModalBuilder()
                    .setCustomId('apply-question')
                    .setTitle(`${(application.applicationItems.indexOf(q) + 1) + ". " + q.question}`.slice(0, 44))
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('answer')
                                    .setLabel('Your answer')
                                    .setStyle(type)
                                    .setMinLength(1)
                                    .setMaxLength(500)
                                    .setPlaceholder('Your answer...')
                                    .setRequired(true)
                                    .setValue(value)
                            )
                    );

                await interaction.showModal(modal);

            }

            if (interaction.customId === submitId) {

                if (answers.length !== application.applicationItems.length) return interaction.reply({
                    embeds: [await generateEmbed(color, `Please fill out all the questions before submitting. (${answers.length}/${application.applicationItems.length})`)], ephemeral: true
                }).catch((e => { }));

                editButton.setDisabled(true);
                submitButton.setDisabled(true);
                backButton.setDisabled(true);

                await interaction.update({
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                editButton, submitButton, backButton
                            )
                    ]
                }).catch((e => { }));

                const uuid = randomUUID();
                const ApplicationAnswer = require('../../../structures/schemas/ApplicationAnswerSchema');
                const newAnswer = new ApplicationAnswer({
                    guildId: interaction.guildId,
                    userId: interaction.user.id,
                    applicationId: application.applicationId,
                    applicationAnswers: answers,
                    responseUuid: uuid,
                    applicationState: "PENDING",
                });
                newAnswer.save();

                await interaction.followUp({
                    embeds: [await generateEmbed(color, "Successfully submitted your application.")], ephemeral: true
                }).catch((e => { }));

                const logChannel = interaction.guild.channels.cache.get(applicationConfig.applicationLogChannelId);
                if (logChannel && applicationConfig.applicationLogEnabled) logChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTitle("New Application Submitted")
                            .setFooter({ text: `${uuid}` })
                            .setDescription(`Application ID: ${application.applicationId}\nSubmitted by: ${interaction.user}\nState: **PENDING**\n\nView the answers [on our dashboard](https://dashboard.quabot.net) (discord support coming soon).`)
                    ], components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("approve-application")
                                    .setLabel("Approve")
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId("deny-application")
                                    .setLabel("Deny")
                                    .setStyle(ButtonStyle.Danger)
                            )
                    ]
                })
            }
        });
    }
}
