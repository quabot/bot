const { ChatInputCommandInteraction, Client, ColorResolvable, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getTicketConfig } = require('../../../utils/configs/ticketConfig');
const Ticket = require('../../../structures/schemas/Ticket');
const { Embed } = require('../../../utils/constants/embed');
const { getIdConfig } = require('../../../utils/configs/idConfig');

module.exports = {
    parent: 'ticket',
    name: 'create',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: true });

        const config = await getTicketConfig(client, interaction.guildId);
        const ids = await getIdConfig(interaction.guildId);

        if (!config || !ids) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('We\'re still setting up some documents for first-time use! Please run the command again.')
            ]
        });

        if (!config.enabled) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Tickets are disabled in this server.')
            ]
        });


        const topic = interaction.options.getString('topic');
        if (!topic) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Please enter all the required fields.')
            ]
        });

        const category = interaction.guild.channels.cache.get(config.openCategory);
        if (!category || category.type !== ChannelType.GuildCategory) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Couldn\'t find any valid configured categories for tickets. You can do this on our [dashboard](https://quabot.net/dashboad).')
            ]
        });


        const channel = await interaction.guild.channels.create({
            name: `ticket-${ids.ticketId}`,
            type: ChannelType.GuildText,
        });
        if (!channel) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Failed to create the channel.')
            ]
        })

        await channel.setParent(category, { lockPermissions: true });
        channel.permissionOverwrites.create(interaction.guild.id, { ViewChannel: false, SendMessages: false });
        channel.permissionOverwrites.create(interaction.user.id, { ViewChannel: true, SendMessages: true });

        config.staffRoles.forEach(r => {
            const role = interaction.guild.roles.cache.get(r);
            if (role) channel.permissionOverwrites.create(role, { ViewChannel: true, SendMessages: true });
        });


        await channel.send({
            embeds: [
                new Embed(color)
                    .setTitle('New Ticket')
                    .setDescription('Please wait, staff will be with you shortly.')
                    .addFields(
                        { name: 'Topic', value: `${topic}`, inline: true },
                        { name: 'Created By', value: `${interaction.user}`, inline: true },
                        { name: 'Claimed by', value: 'Not claimed yet', inline: true }
                    )
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('close-ticket')
                            .setLabel('🔒 Close')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('claim-ticket')
                            .setLabel('🙋‍♂️ Claim')
                            .setStyle(ButtonStyle.Secondary)
                    ),
            ]
        });

        const pingRole = interaction.guild.roles.cache.get(config.staffPing);
        if (pingRole) await channel.send(`${pingRole}`);


        const newTicket = new Ticket({
            guildId: interaction.guildId,

            id: ids.ticketId,
            channelId: channel.id,

            topic,
            closed: false,

            owner: interaction.user.id,
            users: [],
            staff: 'none'
        });
        await newTicket.save();


        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setTitle('Ticket created!')
                    .setDescription(`Check it out here: ${channel}, staff will be with you shortly.`)
            ]
        });


        const logChannel = interaction.guild.channels.cache.get(config.logChannel);
        if (logChannel) await logChannel.send({
            embeds: [
                new Embed(color)
                    .setTitle('Ticket Created')
                    .addFields(
                        { name: 'User', value: `${interaction.user}`, inline: true },
                        { name: 'Channel', value: `${interaction.channel}`, inline: true },
                        { name: 'Topic', value: `${topic}`, inline: true }
                    )
                    .setFooter({ text: `ID: ${ids.ticketId}` })
            ]
        });

        ids.ticketId += 1;
        await ids.save();
    }
};
