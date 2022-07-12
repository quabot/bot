const { MessageEmbed, MessageActionRow, MessageButton, PermissionOverwrites, Permissions, Message, MessageManager, Modal, TextInputComponent } = require('discord.js');
const { randomUUID } = require('node:crypto');
const { v4: uuidv4 } = require('uuid');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "apply",
    description: 'Staff applications.',
    permissions: ["MANAGE_CHANNELS", "SEND_MESSAGES"],
    options: [
        {
            name: "id",
            description: "Application text ID",
            type: "STRING",
            required: true
        }
    ],
    async execute(client, interaction, color) {

        const id = interaction.options.getString("id");

        const Application = require('../../../structures/schemas/ApplicationSchema');
        const ApplicationDatabase = await Application.findOne({
            guildId: interaction.guild.id,
            applicationTextId: id,
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

        const backId = 'backMusic'
        const forwardId = 'forwardMusic'
        const doQuestionId = 'doQuestionApplicaiton'
        const submitId = 'submitApplication'
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
        const doQuestionButton = new MessageButton({
            style: 'PRIMARY',
            label: 'Answer',
            customId: doQuestionId
        });
        const submitButton = new MessageButton({
            style: 'SUCCESS',
            label: 'Submit',
            customId: submitId
        });

        if (ApplicationDatabase.requiredPermission !== "none") {
            if (!interaction.member.permissions.has(ApplicationDatabase.requiredPermission)) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`You do not have permisison to apply for that application.\nYou require ${ApplicationDatabase.requiredPermission} to apply for this application.`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));
        }


        // ! Check if they didnt answer already (answer once ) & check for reaplly

        const questions = ApplicationDatabase.applicationItems;
        await interaction.deferReply({ ephemeral: true });

        let thisQuestion = null;

        let answers = [];

        const makeEmbed = async start => {
            const current = questions.slice(start, start + 1);

            return new MessageEmbed({
                color: color,
                title: `Question ${start + 1}/${questions.length}`,
                fields: await Promise.all(
                    current.map(async (question) => {

                        let currentIndexId = questions.indexOf(question);

                        if (answers.find(item => item.question === currentIndexId)) {

                            const currentAnswer = answers.find(item => item.question === currentIndexId);

                            return (
                                [
                                    {
                                        name: `**Question ${currentIndexId + 1}**`,
                                        value: `${question.question}`
                                    },
                                    {
                                        name: `**Your Answer**`,
                                        value: `${currentAnswer.value}`
                                    }
                                ]
                            )
                        }
                        thisQuestion = question;
                        return ({
                            name: `**Question ${currentIndexId + 1}**`,
                            value: `${question.question}`
                        })
                    })
                )
            });
        }

        const canFit = questions.length <= 1;
        const msg = await interaction.editReply({
            embeds: [await makeEmbed(0)],
            ephemeral: true,
            components: canFit
                ? [new MessageActionRow({ components: [doQuestionButton, submitButton] })]
                : [new MessageActionRow({ components: [forwardButton, doQuestionButton] })]
        })
        if (canFit) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        let currentIndex = 0;

        collector.on('collect', async interaction => {

            if (interaction.customId === doQuestionId) {

                const filter = (interaction) => interaction.customId === 'aquestion';

                interaction.awaitModalSubmit({ filter, time: 600000 })
                    .then(interaction => {

                        /* Checks whether you've already answered this. If you have, it edits the answer instead. */
                        if (answers.find(item => item.question === currentIndex)) {

                            // Removed the old value and adds the new one.
                            for (var i = 0; i < answers.length; i++) {
                                if (answers[i].question === currentIndex) {
                                    answers.splice(i, 1);
                                    i--;
                                }
                            }

                            answers.push({
                                value: `${interaction.fields.getTextInputValue('aquestion-answer')}`,
                                question: currentIndex
                            });

                        } else {
                            // Add the items if it's a new question
                            answers.push({
                                value: `${interaction.fields.getTextInputValue('aquestion-answer')}`,
                                question: currentIndex
                            });
                        }

                        // Displays your answer on the embed
                        interaction.update({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(`${interaction.message.embeds[0].title}`)
                                    .setColor(color)
                                    .addFields(
                                        { name: `${interaction.message.embeds[0].fields[0].name}`, value: `${interaction.message.embeds[0].fields[0].value}` },
                                        { name: "Your Answer", value: `${interaction.fields.getTextInputValue('aquestion-answer')}` }
                                    )
                            ],
                            ephemeral: true
                        }).catch((err => console.log(err)));

                        // Thanks for your reply
                        interaction.followUp({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(color)
                                    .setDescription("Thanks for your reponse! You can move on to the next question.")
                            ], ephemeral: true
                        }).catch((err => { }));

                    })
                    .catch(console.error);

                // create the modal
                const modal = new Modal()
                    .setCustomId('aquestion')
                    .setTitle((questions.indexOf(thisQuestion) + 1) + ". " + thisQuestion.question)
                    .addComponents(
                        new MessageActionRow()
                            .addComponents(
                                new TextInputComponent()
                                    .setCustomId('aquestion-answer')
                                    .setLabel('Your answer')
                                    .setStyle(thisQuestion.type)
                                    .setMinLength(1)
                                    .setMaxLength(350)
                                    .setPlaceholder('Your answer...')
                                    .setRequired(true)
                            )
                    );

                await interaction.showModal(modal);


            } else if (interaction.customId === submitId) {

                let uuid = randomUUID();

                const ApplicationAnswer = require('../../../structures/schemas/ApplicationAnswerSchema');
                const foundAnswer = await ApplicationAnswer.findOne({
                    applicationId: uuid,
                    guildId: interaction.guild,
                }).clone().catch((err => { }));

                const foundUser = await ApplicationAnswer.findOne({
                    applicationUserId: interaction.user.id,
                    guildId: interaction.guild,
                }).clone().catch((err => { }));

                const foundUserList = await ApplicationAnswer.find({
                    applicationUserId: interaction.user.id,
                    guildId: interaction.guild,
                }).clone().catch((err => { }));

                if (foundAnswer) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`There was an error with the UUID. Please try again.`)
                            .setColor(color)
                    ],
                    ephemeral: true
                }).catch((err => { }))

                if (ApplicationDatabase.applicationMultipleAnswers === false && foundUser) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You can only apply once.`)
                            .setColor(color)
                    ],
                    ephemeral: true
                }).catch((err => { }))

                if (questions.length !== answers.length) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Please make sure to fill out all the questions. (${answers.length}/${questions.length})`)
                            .setColor(color)
                    ],
                    ephemeral: true
                }).catch((err => { }));

                const ApplicationConfig = require('../../../structures/schemas/ApplicationConfigSchema');
                const ApplicationConfigDatabase = await ApplicationConfig.findOne({
                    guildId: interaction.guild.id,
                }, (err, config) => {
                    if (err) console.log(err);
                    if (!config) {
                        const newConfig = new ApplicationConfig({
                            guildId: interaction.guild.id,
                            applicationEnabled: true,
                            applicationReapply: false,
                            applicationLogChannelId: "none",
                            applicationAdminRole: "none",
                        });
                        newConfig.save();
                    }
                }).clone().catch((err => { }));

                if (!ApplicationConfigDatabase) {
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`We just created a new database record! Please run that command again!`)
                                .setColor(color)
                        ], ephemeral: true
                    }).catch((err => { }));
                }

                const applicationLogChannel = interaction.guild.channels.cache.get(`${ApplicationConfigDatabase.applicationLogChannelId}`);

                if (!applicationLogChannel) {
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Couldn't find a channel to log your application result. Please ask an admin to configure this on [our dashboard](https://dashboard.quabot.net).`)
                                .setColor(color)
                        ], ephemeral: true
                    }).catch((err => { }));
                }

                await interaction.update({
                    components: [
                        new MessageActionRow(({
                            components: [
                                new MessageButton({
                                    style: 'SECONDARY',
                                    label: 'Back',
                                    emoji: '⬅️',
                                    customId: "disabled1",
                                    disabled: true
                                }),
                                new MessageButton({
                                    style: 'PRIMARY',
                                    label: 'Answer',
                                    customId: "disabled2",
                                    disabled: true
                                }),
                                new MessageButton({
                                    style: 'SUCCESS',
                                    label: 'Submit',
                                    customId: "disabled3",
                                    disabled: true
                                }),
                            ]
                        }))
                    ]
                }).catch((err => { }));

                const newApplication = new ApplicationAnswer({
                    guildId: interaction.guild.id,
                    applicationId: randomUUID(),
                    applicationUserId: interaction.user.id,
                    applicationAnswers: answers,
                    applicationState: "PENDING",
                    applicationTextId: id
                });
                newApplication.save();

                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Thanks for your submission to the '${ApplicationDatabase.applicationName}' application!`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch(console.error);

                applicationLogChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setTitle("Application Answered")
                            .setTimestamp()
                            .setDescription(`${interaction.user} - \`${id}\`\nThey answered this application ${foundUserList.length} times before.\n\nIn order to review their answers, run **/application answers ${id} ${interaction.user}**`)
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('application-approve')
                                    .setLabel('Approve')
                                    .setStyle('SUCCESS'),
                                new MessageButton()
                                    .setCustomId('application-reject')
                                    .setLabel('Deny')
                                    .setStyle('DANGER')
                            )
                    ]
                }).catch((err => { }));

            } else {
                interaction.customId === backId ? (currentIndex -= 1) : (currentIndex += 1)
                await interaction.update({
                    embeds: [await makeEmbed(currentIndex)],
                    components: [
                        new MessageActionRow({
                            components: [
                                ...(currentIndex ? [backButton] : []),
                                ...(currentIndex + 1 < questions.length ? [forwardButton] : []),
                                doQuestionButton,
                                ...(currentIndex + 1 === questions.length ? [submitButton] : []),
                            ]
                        })
                    ]
                });
            }
        });

    }
}