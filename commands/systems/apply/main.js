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

        // check if the user has the permissions and remove those from the array beforehand
        const questions = ApplicationDatabase.applicationItems;
        console.log(ApplicationDatabase)
        console.log(questions)
        const { channel } = interaction;

        interaction.deferReply();

        var thisQuestion = null;

        const makeEmbed = async start => {
            const current = questions.slice(start, start + 1);

            return new MessageEmbed({
                color: color,
                title: `Showing questions ${start + 1}-${start + current.length} out of ${questions.length
                    }`,
                fields: await Promise.all(
                    current.map(async (question) => {
                        thisQuestion = question;
                        return ({
                            name: `**Question ${questions.indexOf(question) + 1}** (${question.type})`,
                            value: `${question.question}`
                        })
                    })
                )
            });
        }

        let answers = [];

        const canFit = questions.length <= 1;
        await wait(1000);
        const msg = await interaction.editReply({
            embeds: [await makeEmbed(0)],
            components: canFit
                ? [new MessageActionRow({ components: [doQuestionButton, submitButton] })]
                : [new MessageActionRow({ components: [forwardButton, doQuestionButton] })]
        })
        if (canFit) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        let currentIndex = 0
        collector.on('collect', async interaction => {
            if (interaction.customId === doQuestionId) {
                console.log(questions[currentIndex])
                const filter = (interaction) => interaction.customId === 'aquestion';
                interaction.awaitModalSubmit({ filter, time: 60_000 })
                    .then(interaction => {
                        /* Checks whether you've already answered this. If you have, it edits the answer instead. */
                        if (answers.length >= questions.indexOf(thisQuestion)+1) {
                            answers[questions.indexOf(thisQuestion)] = interaction.fields.getTextInputValue('aquestion-answer');
                        } else {
                            answers.push(interaction.fields.getTextInputValue('aquestion-answer'));
                        }
                        console.log(answers);
                        interaction.reply({ content: "Thank you for your response! You may now move on to the next question.", ephemeral: true });
                    })
                    .catch(console.error);
                const modal = new Modal()
                    .setCustomId('aquestion')
                    .setTitle("Q" + (questions.indexOf(thisQuestion) + 1) + ": " + thisQuestion.question)
                    .addComponents(
                        new MessageActionRow()
                            .addComponents(
                                new TextInputComponent()
                                    .setCustomId('aquestion-answer')
                                    .setLabel('Your answer')
                                    .setStyle(thisQuestion.type)
                                    .setMinLength(1)
                                    .setMaxLength(1000)
                                    .setPlaceholder('Your answer...')
                                    .setRequired(true)
                            )
                    );

                await interaction.showModal(modal);
            } else if (interaction.customId === submitId) {
                const ApplicationAnswer = require('../../../structures/schemas/ApplicationAnswerSchema');

                //! ADD A UUID CHECK
                // TODO: ADD A UUID CHECK


                const newApplication = new ApplicationAnswer({
                    guildId: interaction.guild.id,
                    applicationId: randomUUID(),
                    applicationUserId: interaction.user.id,
                    applicationAnswers: answers,
                    applicationState: "PENDING",
                });
                newApplication.save();

                return interaction.reply({content:`Thanks for your submittion to the '${ApplicationDatabase.applicationName}' application!`, ephemeral: true})
                    .catch(console.error);
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