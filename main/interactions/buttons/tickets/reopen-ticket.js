const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

// reopen ticket
module.exports = {
    id: "reopen-ticket",
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
                        levelRewards: [],
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
                        funCommands: [
                            '8ball',
                            'brokegamble',
                            'coin',
                            'quiz',
                            'reddit',
                            'rps',
                            'type'
                        ],
                        infoCommands: [
                            'roles',
                            'serverinfo',
                            'userinfo'
                        ],
                        miscCommands: [
                            'avatar',
                            'members',
                            'random',
                            'servericon'
                        ],
                        moderationCommands: [
                            'ban',
                            'clear-punishment',
                            'find-punishment',
                            'kick',
                            'tempban',
                            'timeout',
                            'unban',
                            'untimeout',
                            'warn'
                        ],
                        managementCommands: [
                            'clear',
                            'message',
                            'poll',
                            'reactionroles'
                        ],
                    logsuggestChannelID: "none",
                        funCommands: [
                            '8ball',
                            'brokegamble',
                            'coin',
                            'quiz',
                            'reddit',
                            'rps',
                            'type'
                        ],
                        infoCommands: [
                            'roles',
                            'serverinfo',
                            'userinfo'
                        ],
                        miscCommands: [
                            'avatar',
                            'members',
                            'random',
                            'servericon'
                        ],
                        moderationCommands: [
                            'ban',
                            'clear-punishment',
                            'find-punishment',
                            'kick',
                            'tempban',
                            'timeout',
                            'unban',
                            'untimeout',
                            'warn'
                        ],
                        managementCommands: [
                            'clear',
                            'message',
                            'poll',
                            'reactionroles'
                        ],
                    logPollChannelID: "none",
                        logSuggestChannelID: "none",
                    afkEnabled: true,
                    welcomeChannelID: "none",
                    leaveChannelID: "none",
                    levelChannelID: "none",
                        funEnabled: true,
                        infoEnabled: true,
                        miscEnabled: true,
                        moderationEnabled: true,
                        managementEnabled: true,
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
        }).clone().catch(function (err) {  });


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
        }).clone().catch(function (err) {  });

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


        const openCategory = interaction.guild.channels.cache.get(`${guildDatabase.ticketCategory}`);

        if (!openCategory) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Could not find a tickets category. Did not reopen the ticket. Configure this on [our dashboard](http://localhost:3000)")
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

        channel.setParent(openCategory, { lockPermissions: false }).catch((err => { }));

        channel.permissionOverwrites.edit(ticketFound.owner,
            { VIEW_CHANNEL: true, SEND_MESSAGES: true },
        ).catch((err => { }));

        ticketFound.users.forEach(user => {
            channel.permissionOverwrites.edit(user,
                { VIEW_CHANNEL: true, SEND_MESSAGES: true },
            ).catch((err => { }));
        });

        await ticketFound.updateOne({
            closed: false,
        });

        interaction.message.edit({
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('reopen-ticket')
                            .setLabel('🔓 Reopen')
                            .setStyle('PRIMARY')
                            .setDisabled(true)
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('delete-ticket')
                            .setLabel('🗑️ Delete')
                            .setStyle('DANGER')
                            .setDisabled(true)
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('transcript-ticket')
                            .setLabel('📝 Transcipt')
                            .setStyle('SUCCESS')
                            .setDisabled(true)
                    )
            ],
        }).catch((err => { console.log(err) }));

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setTitle("Ticket Re-Opened!")
                    .setDescription("Close the ticket with the button below this message")
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('close-ticket')
                            .setLabel('🔒 Close')
                            .setStyle('DANGER')
                    )
            ]
        }).catch((err => { console.error(err) }));

    }
}