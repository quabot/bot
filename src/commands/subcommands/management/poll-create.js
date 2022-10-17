const {
    Interaction,
    Client,
    ActionRowBuilder,
    TextInputStyle,
    ModalBuilder,
    TextInputBuilder,
    ButtonStyle,
    ButtonBuilder,
    EmbedBuilder,
} = require('discord.js');
const { checkChannel } = require('../../../structures/functions/channel');
const { getPollConfig } = require('../../../structures/functions/config');
const { generateEmbed } = require('../../../structures/functions/embed');
const Poll = require('../../../structures/schemas/PollSchema');
const ms = require('ms');

module.exports = {
    name: 'create',
    command: 'poll',
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {
        const channel = interaction.options.getChannel('channel');
        const choices = interaction.options.getInteger('choices');
        const duration = interaction.options.getString('duration');

        const pollConfig = await getPollConfig(client, interaction.guildId);
        if (!pollConfig)
            return interaction
                .reply({
                    embeds: [
                        await generateEmbed(
                            color,
                            'We just created a new database record! Please run that command again.'
                        ),
                    ],
                    ephemeral: true,
                })
                .catch(e => {});

        if (pollConfig.pollEnabled === false)
            return interaction
                .reply({
                    embeds: [
                        await generateEmbed(
                            color,
                            'Polls are not enabled in this server. Toggle them on [our dashboard](https://dashboard.quabot.net).'
                        ),
                    ],
                    ephemeral: true,
                })
                .catch(e => {});

        if (!channel || !choices || !duration)
            return interaction
                .reply({
                    embeds: [
                        await generateEmbed(color, "Please run the command again, we didn't get all your options."),
                    ],
                    ephemeral: true,
                })
                .catch(e => {});

        if ((await checkChannel(channel.type)) === false)
            return interaction
                .reply({
                    embeds: [
                        await generateEmbed(
                            color,
                            "Please enter a valid type of channel, i'd like one where i can actually talk."
                        ),
                    ],
                    ephemeral: true,
                })
                .catch(e => {});

        if (!ms(duration))
            return interaction
                .reply({
                    embeds: [await generateEmbed(color, 'Please enter a valid duration, like `1w` or `10min`.')],
                    ephemeral: true,
                })
                .catch(e => {});

        const pollId = pollConfig.pollId + 1;
        const msg = await interaction
            .reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setDescription(
                            `Click the button below this message to enter the details for the poll. When entered, click the _second_ button to enter the choices.`
                        )
                        .addFields(
                            { name: 'Channel', value: `${channel}`, inline: true },
                            { name: 'Duration', value: `${duration}`, inline: true },
                            { name: 'Choices', value: `${choices}`, inline: true }
                        ),
                ],
                ephemeral: true,
                components: [
                    new ActionRowBuilder({
                        components: [
                            new ButtonBuilder({
                                style: ButtonStyle.Secondary,
                                label: 'Enter Details',
                                customId: 'details-poll',
                            }),
                            new ButtonBuilder({
                                style: ButtonStyle.Secondary,
                                label: 'Enter Choices',
                                customId: 'choices-poll',
                            }),
                        ],
                    }),
                ],
                fetchReply: true,
            })
            .catch(e => {});

        if (!msg) return;

        const collector = msg.createMessageComponentCollector({
            filter: ({ user }) => user.id === interaction.user.id,
        });
        collector.on('collect', async interaction => {
            if (interaction.customId === 'details-poll') {
                const pollDocument = await Poll.findOne({
                    interactionId: interaction.message.id,
                    guildId: interaction.guildId,
                })
                    .clone()
                    .catch(e => {});

                const modal = new ModalBuilder()
                    .setTitle('Configure Poll')
                    .setCustomId('info-poll')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('question')
                                .setPlaceholder('Should we add more voice channels?')
                                .setLabel('Poll Question')
                                .setMaxLength(500)
                                .setValue(pollDocument ? (pollDocument.topic === 'none' ? '' : pollDocument.topic) : '')
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('description')
                                .setPlaceholder('Wether or not to add more voice channels to our server.')
                                .setLabel('Poll Description')
                                .setValue(
                                    pollDocument
                                        ? pollDocument.description === 'none'
                                            ? ''
                                            : pollDocument.description
                                        : ''
                                )
                                .setMaxLength(500)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                        )
                    );

                await interaction.showModal(modal);

                if (pollDocument) return;
                const newPoll = new Poll({
                    guildId: interaction.guildId,
                    pollId: pollId,
                    channelId: channel.id,
                    msgId: 'none',
                    description: 'none',
                    options: choices,
                    topic: 'none',
                    duration: ms(duration),
                    interactionId: msg.id,
                    createdTime: new Date().getTime(),
                    endTimestamp: new Date().getTime() + ms(duration),
                    optionsArray: [],
                });
                newPoll.save().catch(e => {});

                const PollConfig = require('../../../structures/schemas/PollConfigSchema');
                const config = await PollConfig.findOne({
                    guildId: interaction.guildId,
                })
                    .clone()
                    .catch(e => {});
                await config.updateOne({
                    pollId,
                });
            } else {
                const pollDocument = await Poll.findOne({
                    interactionId: interaction.message.id,
                    guildId: interaction.guildId,
                })
                    .clone()
                    .catch(e => {});
                let choicesLength = pollDocument ? pollDocument.options : choices;

                const modal = new ModalBuilder().setTitle('Configure Poll').setCustomId('choices-poll');

                for (let index = 0; index < choicesLength; index++) {
                    modal.addComponents(
                        new ActionRowBuilder().setComponents(
                            new TextInputBuilder()
                                .setCustomId(`${index}`)
                                .setLabel(`Choice ${index + 1}`)
                                .setRequired(true)
                                .setMaxLength(200)
                                .setValue(
                                    pollDocument
                                        ? `${pollDocument.optionsArray[index] ? pollDocument.optionsArray[index] : ''}`
                                        : ''
                                )
                                .setStyle(TextInputStyle.Short)
                        )
                    );
                }

                await interaction.showModal(modal);

                if (pollDocument) return;
                const newPoll = new Poll({
                    guildId: interaction.guildId,
                    pollId: pollId,
                    channelId: channel.id,
                    msgId: 'none',
                    description: 'none',
                    options: choices,
                    topic: 'none',
                    duration: ms(duration),
                    interactionId: msg.id,
                    createdTime: new Date().getTime(),
                    endTimestamp: new Date().getTime() + ms(duration),
                    optionsArray: [],
                });
                newPoll.save().catch(e => {});

                const PollConfig = require('../../../structures/schemas/PollConfigSchema');
                const config = await PollConfig.findOne({
                    guildId: interaction.guildId,
                })
                    .clone()
                    .catch(e => {});
                await config.updateOne({
                    pollId,
                });
            }
        });
    },
};
