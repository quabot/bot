const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

// transcript ticket
module.exports = {
    id: "transcript-ticket",
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

        const channel = interaction.guild.channels.cache.get(`${ticketFound.channelId}`);
        if (!channel) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Could not find that channel. This is a bug. Please make a new ticket.")
            ]
        }).catch((err => { }));

        const discordTranscripts = require('discord-html-transcripts');
        const attachment = await discordTranscripts.createTranscript(channel);

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("This ticket transcript is in the attachment. Open it in the browser to see it.")
            ],
            files: [attachment]
        }).catch((err => { console.error(err) }));

    }
}