const { ChatInputCommandInteraction, Client, ColorResolvable, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const ms = require('ms');
const Poll = require('../../../structures/schemas/Poll');
const { getIdConfig } = require('../../../utils/configs/idConfig');
const { getPollConfig } = require('../../../utils/configs/pollConfig');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
    parent: 'poll',
    name: 'create',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {

        const config = await getPollConfig(client, interaction.guildId);
        const ids = await getIdConfig(client, interaction.guildId);
        if (!config || !ids) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('We\'re still setting up some documents for first-time use. Please run the command again.')
            ]
        });

        if (!config.enabled) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('Polls are not enabled in this server.')
            ]
        });


        const channel = interaction.options.getChannel('channel');
        let choices = interaction.options.getNumber('choices');
        const duration = interaction.options.getString('duration');
        const role = interaction.options.getRole('role-mention') ?? null;

        if (!channel || !choices || !duration) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('Please enter all the required fields')
            ]
        });


        if (channel.type !== ChannelType.GuildAnnouncement && channel.type !== ChannelType.GuildText) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('Please create the poll in either a text or announcement channel.')
            ]
        });


        if (choices < 2) choices = 2;
        if (choices > 5) choices = 5;


        if (!ms(duration)) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('Please enter a valid duration. Eg. 1h, 5m, 1d etc.')
            ]
        });

        if (ms(duration) > 2147483647) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('Please enter a value that is below 24 days.')
            ]
        });


        const message = await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription(
                        `Click the blue button below this message to enter the details for the poll. When entered, click the gray button to enter the choices.`
                    )
                    .addFields(
                        { name: 'Channel', value: `${channel}`, inline: true },
                        { name: 'Duration', value: `${duration}`, inline: true },
                        { name: 'Choices', value: `${choices}`, inline: true },
                        { name: 'Role', value: `${role ? role : 'None'}`, inline: true }
                    ),
            ],
            ephemeral: true,
            components: [
                new ActionRowBuilder({
                    components: [
                        new ButtonBuilder({
                            style: ButtonStyle.Primary,
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
            ], fetchReply: true
        });

        if (!message) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription(`I do not have the required permissions to send messages in ${channel}.`)
            ]
        });



        const collector = message.createMessageComponentCollector({
            filter: ({ user }) => user.id === interaction.user.id,
            time: 60000
        });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'details-poll') {
                const document = await Poll.findOne({
                    guildId: interaction.guildId,
                    interaction: message.id
                });

                const modal = new ModalBuilder()
                    .setTitle('Configure Poll')
                    .setCustomId('info-poll')
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('question')
                                    .setPlaceholder('Poll Question...')
                                    .setLabel('Poll Question')
                                    .setMaxLength(500)
                                    .setValue(document ? (document.topic === 'none' ? '' : document.topic) : '')
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Short)
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('description')
                                    .setPlaceholder('Wether or not to add more voice channels to our server.')
                                    .setLabel('Poll Description')
                                    .setValue(document ? document.description === 'none' ? '' : document.description : '')
                                    .setMaxLength(500)
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Paragraph)
                            )
                    );

                await interaction.showModal(modal);

                if (document) return;

                const newPoll = new Poll({
                    guildId: interaction.guildId,
                    id: ids.pollId,
                    channel: channel.id,
                    message: 'none',
                    interaction: message.id,

                    topic: 'none',
                    description: 'none',

                    duration: ms(duration),
                    optionsCount: choices,
                    options: [],

                    created: new Date().getTime(),
                    endTimestamp: new Date().getTime() + ms(duration),
                });
                await newPoll.save();
            } else {
                const document = await Poll.findOne({
                    guildId: interaction.guildId,
                    interaction: message.id
                });

                const modal = new ModalBuilder()
                    .setTitle('Configure Poll')
                    .setCustomId('choices-poll')

                for (let index = 0; index < choicesLength; index++)
                    modal.addComponents(
                        new ActionRowBuilder()
                            .setComponents(
                                new TextInputBuilder()
                                    .setCustomId(`${index}`)
                                    .setLabel(`Option ${index + 1}`)
                                    .setRequired(true)
                                    .setMaxLength(200)
                                    .setValue(
                                        document
                                            ? `${document.optionsArray[index] ? document.optionsArray[index] : ''}`
                                            : ''
                                    )
                                    .setStyle(TextInputStyle.Short)
                            )
                    );


                await interaction.showModal(modal);

                if (document) return;

                const newPoll = new Poll({
                    guildId: interaction.guildId,
                    id: ids.pollId,
                    channel: channel.id,
                    message: 'none',
                    interaction: message.id,

                    topic: 'none',
                    description: 'none',

                    duration: ms(duration),
                    optionsCount: choices,
                    options: [],

                    created: new Date().getTime(),
                    endTimestamp: new Date().getTime() + ms(duration),
                });
                await newPoll.save();
            }
        });
        // details button
        // choices button
        // when both, cancel and send button

        // send channel msg
        // create db document
        // update id

        // start timer
    }
};
