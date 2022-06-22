const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

// close ticket
module.exports = {
    id: "close-ticket",
    async execute(interaction, client, color) {

        const Guild = require('../../../structures/schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: interaction.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    logChannelID: "none",
                    ticketCategory: "none",
                    ticketClosedCategory: "none",
                    ticketEnabled: true,
                    ticketStaffPing: true,
                    ticketTopicButton: true,
                    ticketSupport: "none",
                    ticketId: 1,
                    ticketLogs: true,
                    ticketChannelID: "none",
                    afkStatusAllowed: "true",
                    musicEnabled: "true",
                    musicOneChannelEnabled: "false",
                    musicChannelID: "none",
                    suggestChannelID: "none",
                    logSuggestChannelID: "none",
                    logPollChannelID: "none",
                    afkEnabled: true,
                    welcomeChannelID: "none",
                    leaveChannelID: "none",
                    levelChannelID: "none",
                    punishmentChannelID: "none",
                    pollID: 0,
                    logEnabled: true,
                    modEnabled: true,
                    levelEnabled: false,
                    welcomeEmbed: true,
                    pollEnabled: true,
                    suggestEnabled: true,
                    welcomeEnabled: true,
                    leaveEnabled: true,
                    roleEnabled: false,
                    mainRole: "none",
                    joinMessage: "Welcome {user} to **{guild}**!",
                    leaveMessage: "Goodbye {user}!",
                    swearEnabled: false,
                    levelCard: false,
                    levelEmbed: true,
                    levelMessage: "{user} just leveled up to level **{level}**!",
                        membersChannel: "none",
                        membersMessage: "Members: {count}",
                        memberEnabled: true
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                    });
            }
        }).clone().catch(function (err) { console.log(err) });


        if (!guildDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`We added this server to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        if (guildDatabase.ticketEnabled === false) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`The tickets module is disabled in this server.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        const Ticket = require('../../../structures/schemas/TicketSchema');
        const ticketFound = await Ticket.findOne({
            channelId: interaction.message.channel.id,
        }, (err, ticket) => {
            if (err) console.error(err);
        }).clone().catch(function (err) { console.log(err) });

        if (!ticketFound) return interaction.reply({
            embeds: [
                new MessageEmbed()
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
                new MessageEmbed()
                    .setDescription(`This is not your ticket! You must be added to the ticket to use that button.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));


        const closedCategory = interaction.guild.channels.cache.get(`${guildDatabase.ticketClosedCategory}`);

        if (!closedCategory) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Could not find a closed tickets category. Did not close the ticket. Configure this on [our dashboard](https://dashboard.quabot.net)")
            ]
        }).catch((err => { }));

        const channel = interaction.guild.channels.cache.get(`${ticketFound.channelId}`);
        if (!channel) return interaction.reply({
            embeds: [
                new MessageEmbed()
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
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('close-ticket')
                            .setLabel('🔒 Close')
                            .setStyle('DANGER')
                            .setDisabled(true)
                    )
            ],
        }).catch((err => { console.log(err) }));

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setTitle("Ticket Closed")
                    .setDescription("Reopen, delete or get a transcript with the buttons below this message.")
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('reopen-ticket')
                            .setLabel('🔓 Reopen')
                            .setStyle('PRIMARY')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('delete-ticket')
                            .setLabel('🗑️ Delete')
                            .setStyle('DANGER')
                    )
                    .addComponents(
                        new MessageButton()
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

        const logChannel = interaction.guild.channels.cache.get(`${guildDatabase.ticketChannelID}`);
        if (!logChannel) return;
        if (guildDatabase.ticketLogs === false) return;
        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle("Ticket Closed")
            .setDescription("Ticket transcript added as attachment.")
            .addFields(
                { name: "User", value: `${interaction.user}`, inline: true },
                { name: "Channel", value: `${interaction.channel.id}`, inline: true }
            );

        logChannel.send({ embeds: [embed], files: [attachment] }).catch((err => { }));
    }
}