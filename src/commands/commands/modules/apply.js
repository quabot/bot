const { ApplicationCommandOptionType, PermissionFlagsBits, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextInputStyle, ModalBuilder, TextInputBuilder } = require('discord.js');
const { getApplicationConfig } = require('../../../structures/functions/config');
const { generateEmbed } = require('../../../structures/functions/embed');
const Application = require('../../../structures/schemas/ApplicationSchema');
const ApplicationAnswer = require('../../../structures/schemas/ApplicationAnswerSchema');

module.exports = {
    name: "apply",
    description: 'Apply for an application',
    permissions: [PermissionFlagsBits.SendMessages],
    options: [
        {
            name: "id",
            description: "The id of the application to apply for.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
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
        const editId = 'edit-apply';
        const submitId = 'edit-apply';
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
                                    value: `${item.question}\n\n**Your Answer**\n${currentAnswer.value}`,
                                    inline: false
                                }
                            );

                        } else {

                            return ({
                                name: `${item.question}`,
                                value: `ass`,
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
                ? [currentAnswer ? editButton : enterButton, submitButton]
                : [new ActionRowBuilder({ components: [enterButton, forwardButton] })]
        }).catch((e => { }));
        if (canFit) return;
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

                        await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`${interaction.message.embeds[0].title}`)
                                    .setColor(Colors.Green)
                                    .addFields(
                                        { name: `${interaction.message.embeds[0].fields[0].name}`, value: `${interaction.message.embeds[0].fields[0].value}` },
                                        { name: "Your Answer", value: `${interaction.fields.getTextInputValue('answer')}` }
                                    )
                            ],
                        }).catch((e => { }));

                        interaction.followUp({
                            embeds: [await generateEmbed(color, "Thanks for responding! You can move on to the next question.")], ephemeral: true
                        })

                    });

                // Create the modal
                const type = q.type === "SHORT" ? TextInputStyle.Short : TextInputStyle.Paragraph;

                const modal = new ModalBuilder()
                    .setCustomId('apply-question')
                    .setTitle((application.applicationItems.indexOf(q) + 1) + ". " + q.question)
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('answer')
                                    .setLabel('Your answer')
                                    .setStyle(type)
                                    .setMinLength(1)
                                    .setMaxLength(350)
                                    .setPlaceholder('Your answer...')
                                    .setRequired(true)
                            )
                    );

                await interaction.showModal(modal);

                // edit
                // submit
                // edit support
            }
        });

        // make application

        // store answers

    }
}
