const {
    Client,
    Interaction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    ChannelType,
} = require('discord.js');
const { getTicketConfig } = require('../../../structures/functions/config');
const { generateEmbed } = require('../../../structures/functions/embed');
const Ticket = require('../../../structures/schemas/TicketSchema');

module.exports = {
    name: 'claim',
    command: 'ticket',
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();
        const ticketConfig = await getTicketConfig(client, interaction.guildId);

        if (!ticketConfig)
            return interaction
                .editReply({
                    embeds: [
                        await generateEmbed(
                            color,
                            'We just created a new database record. Please run that command again.'
                        ),
                    ],
                })
                .catch(e => { });

        if (ticketConfig.ticketEnabled === false)
            return interaction
                .editReply({
                    embeds: [await generateEmbed(color, 'Tickets are disabled in this server.')],
                })
                .catch(e => { });

        const Ticket = require('../../../structures/schemas/TicketSchema');

        const ticketFound = await Ticket.findOne({
            channelId: interaction.channel.id,
        })
            .clone()
            .catch(function (err) { });

        if (!ticketFound)
            return interaction
                .editReply({
                    embeds: [await generateEmbed(color, "You're not inside of a ticket!")],
                })
                .catch(e => { });

        const role = interaction.guild.roles.cache.get(ticketConfig.ticketSupport);
        if (!role)
            return interaction
                .editReply({
                    embeds: [await generateEmbed(color, 'There is no support role, so you cannot claim the ticket.')],
                })
                .catch(e => { });


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
                        await generateEmbed(color, 'You cannot manage this ticket, you must have the support role.'),
                    ],
                })
                .catch(e => { });

        const member = interaction.guild.members.cache.get(ticketFound.staff);
        if (member && (member.roles.cache.has(role.id) || member.permissions.has(PermissionFlagsBits.Administrator)))
            return interaction
                .editReply({
                    embeds: [
                        await generateEmbed(color, `This ticket is already claimed by <@${ticketFound.staff}>!`),
                    ],
                })
                .catch(e => { });

        const ticketMsg = (await interaction.channel.messages.fetch()).last();

        ticketFound.staff = interaction.user.id;
        await ticketFound.save();

        ticketMsg
            .edit({
                embeds: [
                    EmbedBuilder.from(ticketMsg.embeds[0]).setFields(
                        { name: 'Topic', value: `${ticketMsg.embeds[0].fields[0].value}`, inline: true },
                        { name: 'Created By', value: `${ticketMsg.embeds[0].fields[1].value}`, inline: true },
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
            .catch(e => { });

        await interaction.deleteReply().catch(err => {
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
                .catch(e => { });
    },
};
