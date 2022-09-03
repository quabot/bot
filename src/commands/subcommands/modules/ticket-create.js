const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const { getTicketConfig } = require('../../../structures/functions/config');
const { generateEmbed } = require('../../../structures/functions/embed');
const Ticket = require('../../../structures/schemas/TicketSchema');

module.exports = {
    name: "create",
    command: "ticket",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: true });
        const ticketConfig = await getTicketConfig(client, interaction.guildId);


        if (!ticketConfig) return interaction.editReply({
            embeds: [await generateEmbed(color, "We just created a new database record. Please run that command again.")]
        }).catch(() => null);

        if (ticketConfig.ticketEnabled === false) return interaction.editReply({
            embeds: [await generateEmbed(color, "Tickets are disabled in this server.")]
        }).catch(() => null);
        

        async function createTicket(ticketConfig, interaction, subject) {

            let role = interaction.guild.roles.cache.get(`${ticketConfig.ticketSupport}`);

            const openCategory = interaction.guild.channels.cache.get(`${ticketConfig.ticketCategory}`);

            if (!openCategory) return interaction.editReply({
                embeds: [await generateEmbed(color, "Couldn't find a tickets category. Configure this on [our dashboard](https://dashboard.quabot.net).")]
            }).catch(() => null);

            let ticketId = parseInt(`${ticketConfig.ticketId}`) + 1;

            const channel = await interaction.guild.channels.create({
                name: `ticket-${ticketId}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                    },
                ]
            });

            channel.permissionOverwrites.create(role,
                { ViewChannel: true, SendMessages: true },
            );

            channel.setParent(openCategory, { lockPermissions: false });

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle("New Ticket")
                .setDescription("Please wait, staff will be with you shortly.")
                .addFields(
                    { name: "Topic", value: `${subject}`, inline: true },
                    { name: "Created By", value: `${interaction.user}`, inline: true }
                )
                .setTimestamp()

            channel.send({
                embeds: [embed],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('close-ticket')
                                .setLabel('🔒 Close')
                                .setStyle(ButtonStyle.Secondary)
                        )
                ],
            }).catch((err) => { });

            if (role) channel.send(`${role}`);

            const newTicket = new Ticket({
                guildId: interaction.guild.id,
                ticketId: ticketId,
                channelId: channel.id,
                topic: subject,
                closed: false,
                owner: interaction.user.id,
                users: [],
            });
            await newTicket.save();

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle("Ticket Created")
                        .setDescription(`Check it out here: ${channel}. Staff will be with you shortly!`)
                        .setTimestamp()
                ]
            }).catch((err) => { });

            await ticketConfig.updateOne({
                ticketId: ticketId,
            });
        }

        createTicket(ticketConfig, interaction, interaction.options.getString("topic") ? interaction.options.getString("topic") : "No topic speciified.");

        module.exports = { createTicket };

    }
}
