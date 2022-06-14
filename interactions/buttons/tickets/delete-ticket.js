const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

// delete ticket
module.exports = {
    id: "delete-ticket",
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

        const channel = interaction.guild.channels.cache.get(`${ticketFound.channelId}`);
        if (!channel) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Could not find that channel. This is a bug. Please make a new ticket.")
            ]
        }).catch((err => { }));

        const msg = await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Are you sure you want to delete this ticket?")
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('cancel-ticket')
                            .setLabel('🚫 Cancel')
                            .setStyle('DANGER')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('confirm-ticket')
                            .setLabel('✅ Confirm')
                            .setStyle('SUCCESS')
                    )
            ], fetchReply: true
        }).catch((err => { }));

        const collectorRepeat = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

        collectorRepeat.on('collect', async interaction => {
            if (interaction.customId === "cancel-ticket") {

                interaction.message.edit({
                    components: [new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('cancel-ticket')
                                .setLabel('🚫 Cancel')
                                .setStyle('DANGER')
                                .setDisabled(true)
                        )
                        .addComponents(
                            new MessageButton()
                                .setCustomId('confirm-ticket')
                                .setLabel('✅ Confirm')
                                .setStyle('SUCCESS')
                                .setDisabled(true)
                        )
                ]
                })
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setDescription("Cancelled the ticket deletion.")
                    ]
                }).catch((err => { }));

                return;

            }
            if (interaction.customId === "confirm-ticket") {

                const discordTranscripts = require('discord-html-transcripts');
                const attachment = await discordTranscripts.createTranscript(channel, {
                    limit: -1,
                    minify: true,
                    saveImages: false,
                    useCND: true
                });


                await Ticket.findOneAndDelete({
                    channelId: interaction.message.channel.id,
                }, (err, ticket) => {
                    if (err) console.error(err);
                }).clone().catch(function (err) { console.log(err) });

                channel.delete();

                const logChannel = interaction.guild.channels.cache.get(`${guildDatabase.ticketChannelID}`);
                if (!logChannel) return;
                if (guildDatabase.ticketLogs === false) return;
                const embed = new MessageEmbed()
                    .setColor(color)
                    .setTitle("Ticket Deleted")
                    .setDescription("Ticket transcript added as attachment.")
                    .addFields(
                        { name: "User", value: `${interaction.user}`, inline: true },
                        { name: "Channel", value: `#${interaction.channel.name}`, inline: true }
                    );

                logChannel.send({ embeds: [embed], files: [attachment] }).catch((err => { }));

            }
        });
    }
}