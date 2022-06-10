const { MessageEmbed, MessageActionRow, MessageButton, PermissionOverwrites, Permissions } = require('discord.js');

module.exports = {
    name: "ticket",
    description: 'Ticket Module.',
    options: [
        {
            name: "create",
            description: "Create a ticket.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "topic",
                    type: "STRING",
                    required: false,
                    description: "The ticket topic."
                }
            ]
        },
    ],
    async execute(client, interaction, color) {

        const Guild = require('../../structures/schemas/GuildSchema');
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

        const subCmd = interaction.options.getSubcommand();

        switch (subCmd) {
            case "create":

                let subject = interaction.options.getString("subject");
                if (!subject) subject = "No subject specified.";

                let role = interaction.guild.roles.cache.get(`${guildDatabase.ticketSupport}`);

                const openCategory = interaction.guild.channels.cache.get(`${guildDatabase.ticketCategory}`);

                if (!openCategory) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Could not find a tickets category. Configure this in our [dashboard](https://dashboard.quabot.net)!`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

                let ticketId = parseInt(`${guildDatabase.ticketId}`) + 1;

                const channel = await interaction.guild.channels.create(`ticket-${ticketId}`, {
                    type: "TEXT",
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                        },
                        {
                            id: interaction.user.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                        },
                    ]
                });

                channel.permissionOverwrites.create(role,
                    { VIEW_CHANNEL: true, SEND_MESSAGES: true },
                );
                
                channel.setParent(openCategory, { lockPermissions: false });

                const embed = new MessageEmbed()
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
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('close-ticket')
                                    .setLabel('🔒 Close')
                                    .setStyle('DANGER')
                            )
                    ],
                }).catch((err) => { });

                if (role) channel.send(`${role}`);

                const Ticket = require('../../structures/schemas/TicketSchema');
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

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setTitle("Ticket Created")
                            .setDescription(`Check it out here: ${channel}. Staff will be with you shortly!`)
                            .setTimestamp()
                    ]
                }).catch((err) => { });

                await guildDatabase.updateOne({
                    ticketId: ticketId,
                });

                break;
        }
    }
}