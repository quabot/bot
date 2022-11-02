const {
    Client,
    Interaction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    PermissionFlagsBits,
    ButtonStyle,
} = require('discord.js');
const Ticket = require('../../../structures/schemas/TicketSchema');
const { generateEmbed } = require('../../../structures/functions/embed');
const { getTicketConfig } = require('../../../structures/functions/config');

module.exports = {
    id: 'close-ticket',
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(client, interaction, color) {
        const ticketConfig = await getTicketConfig(client, interaction.guildId);
        await interaction.deferReply().catch(e => {});

        if (!ticketConfig)
            return await interaction
                .editReply({
                    embeds: [
                        await generateEmbed(
                            color,
                            'We just created a new database record. Please click that button again.'
                        ),
                    ],
                })
                .catch(e => {});

        if (ticketConfig.ticketEnabled === false)
            return await interaction
                .editReply({
                    embeds: [await generateEmbed(color, 'Tickets are disabled in this server.')],
                })
                .catch(e => {});

        const ticketFound = await Ticket.findOne({
            channelId: interaction.message.channel.id,
        })
            .clone()
            .catch(function (err) {});

        if (!ticketFound)
            return await interaction
                .editReply({
                    embeds: [await generateEmbed(color, 'You are not inside of an existing ticket.')],
                })
                .catch(e => {});

        let valid = false;
        if (ticketFound.owner === interaction.user.id) valid = true;
        if (ticketFound.users.includes(interaction.user.id)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) valid = true;

        if (!valid)
            return await interaction
                .editReply({
                    embeds: [await generateEmbed(color, 'You cannot manage this ticket. You must be added first.')],
                })
                .catch(e => {});

        const closedCategory = interaction.guild.channels.cache.get(`${ticketConfig.ticketClosedCategory}`);

        if (!closedCategory)
            return await interaction
                .editReply({
                    embeds: [
                        await generateEmbed(
                            color,
                            "Couldn't find the Closed Tickets category. Configure this on [our dashboard](https://dashboard.quabot.net)."
                        ),
                    ],
                })
                .catch(e => {});

        const channel = interaction.guild.channels.cache.get(`${ticketFound.channelId}`);
        if (!channel)
            return await interaction
                .editReply({
                    embeds: [
                        await generateEmbed(
                            color,
                            "Couldn't find the ticket channel; this shouldn't be possible. Please make a new ticket or [contact our support](https://discord.quabot.net)."
                        ),
                    ],
                })
                .catch(e => {});

        channel.setParent(closedCategory, { lockPermissions: false }).catch(e => {});

        channel.permissionOverwrites.edit(ticketFound.owner, { ViewChannel: true, SendMessages: false }).catch(e => {});

        ticketFound.users.forEach(user => {
            channel.permissionOverwrites.edit(user, { ViewChannel: true, SendMessages: false }).catch(e => {});
        });

        interaction.message
            .edit({
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('close-ticket')
                            .setLabel('🔒 Close')
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    ),
                ],
            })
            .catch(e => {});

        await interaction
            .editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle('Ticket Closed')
                        .setDescription('Reopen, delete or get a transcript with the buttons below this message.'),
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('reopen-ticket')
                                .setLabel('🔓 Reopen')
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('delete-ticket')
                                .setLabel('🗑️ Delete')
                                .setStyle(ButtonStyle.Danger)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('transcript-ticket')
                                .setLabel('📝 Transcript')
                                .setStyle(ButtonStyle.Success)
                        ),
                ],
            })
            .catch(err => {
                console.error(err);
            });

        await ticketFound.updateOne({
            closed: true,
        });

        const discordTranscripts = require('discord-html-transcripts');
        const attachment = await discordTranscripts.createTranscript(channel, {
            limit: -1,
            minify: true,
            saveImages: false,
            useCND: true,
        });

        const logChannel = interaction.guild.channels.cache.get(`${ticketConfig.ticketChannelID}`);
        if (logChannel && ticketConfig.ticketLogs === true)
            logChannel
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTitle('Ticket Closed')
                            .setDescription('Ticket transcript added as attachment.')
                            .addFields(
                                { name: 'User', value: `${interaction.user}`, inline: true },
                                {
                                    name: 'Channel',
                                    value: `${interaction.channel} (#${interaction.channel.name})`,
                                    inline: true,
                                }
                            ),
                    ],
                    files: [attachment],
                })
                .catch(e => {});
    },
};
