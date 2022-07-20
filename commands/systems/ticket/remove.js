const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionOverwrites, Permissions, Message, MessageManager, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "remove",
    command: "ticket",
    async execute(client, interaction, color) {

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

        const member = interaction.options.getUser("user");

        const ticket = await Ticket.findOne({
            channelId: interaction.channel.id,
        }, (err, ticket) => {
            if (err) console.error(err);
        }).clone().catch(function (err) { });

        if (!ticket) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Could not find that ticket in our records.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        let allowed = false;
        if (ticket.owner === interaction.user.id) allowed = true;
        if (ticket.users.includes(interaction.user.id)) allowed = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) allowed = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) allowed = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) allowed = true;

        if (!allowed) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`This is not your ticket! You must be added to the ticket to use that button.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        if (!ticket.users.includes(member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`That user is not in this ticket!`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        const users = ticket.users;
        for (var i = 0; i < users.length; i++) {
            if (users[i] === `${member.id}`) {
                users.splice(i, 1);
                i--;
            }
        }

        await ticket.updateOne({
            users: users
        });

        interaction.channel.permissionOverwrites.edit(member,
            { ViewChannel: false, SendMessages: false },
        ).catch((err => { }));

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`Removed ${member} from the ticket.`)
            ]
        }).catch((err => { }));

    }
}
