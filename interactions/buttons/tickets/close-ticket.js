const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

// close ticket
module.exports = {
    id: "close-ticket",
    async execute(interaction, client, color) {

        const TicketConfig = require('../../../structures/schemas/TicketConfigSchema');
        const ticketConfigDatabase = await TicketConfig.findOne({
            guildId: interaction.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newTicketConfig = new TicketConfig({
                    guildId: interaction.guild.id,
                    ticketCategory: "none",
                    ticketClosedCategory: "none",
                    ticketEnabled: true,
                    ticketStaffPing: true,
                    ticketTopicButton: true,
                    ticketSupport: "none",
                    ticketId: 1,
                    ticketLogs: true,
                    ticketChannelID: "none",
                })
                newTicketConfig.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new EmbedBuilder().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                    });
            }
        }).clone().catch(function (err) { });



        if (!ticketConfigDatabase) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`We added this server to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        if (ticketConfigDatabase.ticketEnabled === false) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`The tickets module is disabled in this server.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        const Ticket = require('../../../structures/schemas/TicketSchema');
        const ticketFound = await Ticket.findOne({
            channelId: interaction.message.channel.id,
        }, (err, ticket) => {
            if (err) console.error(err);
        }).clone().catch(function (err) {  });

        if (!ticketFound) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Could not find that ticket in our records.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        let valid = false;
        if (ticketFound.owner === interaction.user.id) valid = true;
        if (ticketFound.users.includes(interaction.user.id)) valid = true;
        if (interaction.member.permissions.has("ADMINISTRATOR")) valid = true;
        if (interaction.member.permissions.has("MANAGE_CHANNELS")) valid = true;
        if (interaction.member.permissions.has("MANAGE_SERVER")) valid = true;

        if (!valid) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`This is not your ticket! You must be added to the ticket to use that button.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));


        const closedCategory = interaction.guild.channels.cache.get(`${ticketConfigDatabase.ticketClosedCategory}`);

        if (!closedCategory) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Could not find a closed tickets category. Did not close the ticket. Configure this on [our dashboard](https://dashboard.quabot.net)")
            ]
        }).catch((err => { }));

        const channel = interaction.guild.channels.cache.get(`${ticketFound.channelId}`);
        if (!channel) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Could not find that channel. This is a bug. Please make a new ticket.")
            ]
        }).catch((err => { }));

        channel.setParent(closedCategory, { lockPermissions: false }).catch((err => { }));

        channel.permissionOverwrites.edit(ticketFound.owner,
            { VIEW_CHANNEL: true, SEND_MESSAGES: false },
        ).catch((err => { }));

        ticketFound.users.forEach(user => {
            channel.permissionOverwrites.edit(user,
                { VIEW_CHANNEL: true, SEND_MESSAGES: false },
            ).catch((err => { }));
        });

        interaction.message.edit({
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('close-ticket')
                            .setLabel('🔒 Close')
                            .setStyle('DANGER')
                            .setDisabled(true)
                    )
            ],
        }).catch((err => { console.log(err) }));

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle("Ticket Closed")
                    .setDescription("Reopen, delete or get a transcript with the buttons below this message.")
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('reopen-ticket')
                            .setLabel('🔓 Reopen')
                            .setStyle('PRIMARY')
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('delete-ticket')
                            .setLabel('🗑️ Delete')
                            .setStyle('DANGER')
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('transcript-ticket')
                            .setLabel('📝 Transcipt')
                            .setStyle('SUCCESS')
                    )
            ],
        }).catch((err => { console.error(err) }));

        await ticketFound.updateOne({
            closed: true,
        });

        const discordTranscripts = require('discord-html-transcripts');
        const attachment = await discordTranscripts.createTranscript(channel, {
            limit: -1,
            minify: true,
            saveImages: false,
            useCND: true
        });

        const logChannel = interaction.guild.channels.cache.get(`${ticketConfigDatabase.ticketChannelID}`);
        if (!logChannel) return;
        if (ticketConfigDatabase.ticketLogs === false) return;
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Ticket Closed")
            .setDescription("Ticket transcript added as attachment.")
            .addFields(
                { name: "User", value: `${interaction.user}`, inline: true },
                { name: "Channel", value: `${interaction.channel} (#${interaction.channel.name})`, inline: true }
            );

        logChannel.send({ embeds: [embed], files: [attachment] }).catch((err => { }));
    }
}