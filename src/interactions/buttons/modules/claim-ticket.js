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
    id: 'claim-ticket',
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(client, interaction, color) {
        const ticketConfig = await getTicketConfig(client, interaction.guildId);
        await interaction.deferReply().catch(e => {});

        if (!ticketConfig)
            return interaction
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
            return interaction
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
            return interaction
                .editReply({
                    embeds: [await generateEmbed(color, 'You are not inside of an existing ticket.')],
                })
                .catch(e => {});

        const role = interaction.guild.roles.cache.get('943796762676711424');

        let valid = false;
        if (ticketFound.owner === interaction.user.id) valid = true;
        if (interaction.member.roles.cache.has(role.id)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) valid = true;

        if (!valid)
            return interaction
                .editReply({
                    embeds: [
                        await generateEmbed(color, 'You cannot manage this ticket. You must have the support role.'),
                    ],
                })
                .catch(e => {});

        const channel = interaction.guild.channels.cache.get(`${ticketFound.channelId}`);

        if (!channel)
            return interaction
                .editReply({
                    embeds: [
                        await generateEmbed(
                            color,
                            "Couldn't find the ticket channel; this shouldn't be possible. Please make a new ticket or [contact our support](https://discord.quabot.net)."
                        ),
                    ],
                })
                .catch(e => {});

        interaction.message
            .edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]).setFields(
                        { name: 'Topic', value: `${interaction.message.embeds[0].fields[0].value}`, inline: true },
                        { name: 'Created By', value: `${interaction.message.embeds[0].fields[1].value}`, inline: true },
                        { name: 'Claimed by', value: `${interaction.user}`, inline: true }
                    ),
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('close-ticket')
                            .setLabel('🔒 Close')
                            .setStyle(ButtonStyle.Secondary)
                    ),
                ],
            })
            .catch(e => {});

        interaction.deleteReply().catch(err => {
            console.error(err);
        });

        const logChannel = interaction.guild.channels.cache.get(`${ticketConfig.ticketChannelID}`);
        if (logChannel && ticketConfig.ticketLogs === true)
            logChannel
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTitle('Ticket Claimed')
                            .addFields(
                                { name: 'User', value: `${interaction.user}`, inline: true },
                                {
                                    name: 'Channel',
                                    value: `${interaction.channel} (#${interaction.channel.name})`,
                                    inline: true,
                                }
                            ),
                    ],
                })
                .catch(e => {});
    },
};
