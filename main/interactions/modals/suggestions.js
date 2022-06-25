const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    id: "suggestion",
    async execute(interaction, client, color) {
        const suggestion = interaction.fields.getTextInputValue('suggestion-box');

        await interaction.deferReply({ ephemeral: true });

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
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                    });
            }
        }).clone().catch(function (err) { });

        if (!guildDatabase) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Added this server to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))

        if (guildDatabase.suggestEnabled === false) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Suggestions are disabled in this server!`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))

        const channel = interaction.guild.channels.cache.get(guildDatabase.suggestChannelID);
        if (!channel) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription("No suggestions channel setup!")
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))

        const msg = await channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle("New Suggestion!")
                    .setTimestamp()
                    .addFields(
                        { name: "Suggestion", value: `${suggestion}` },
                        { name: "Suggested by", value: `${interaction.user}` }
                    )
                    .setFooter({ text: "Vote with the 🟢 and 🔴 below this message!" })
                    .setColor(color)
            ], fetchReply: true
        }).catch(err => {
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`I don't have the required permissions to send messages in that channel.`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }))
        });

        if (!msg) return;

        const suggestLogChannel = interaction.guild.channels.cache.get(guildDatabase.logSuggestChannelID);
        if (suggestLogChannel) {
            suggestLogChannel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("New Suggestion!")
                        .setTimestamp()
                        .addFields(
                            { name: "Suggestion", value: `${suggestion}` },
                            { name: "Suggested by", value: `${interaction.user}`, inline: true },
                            { name: "Suggested in", value: `${interaction.channel}`, inline: true },
                            { name: "Message", value: `[Click to jump](${msg.url})`, inline: true }
                        )
                        .setColor(color)
                        .setFooter({ text: `${msg.id}` })
                ], components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('delete-suggestion')
                                .setLabel('🗑️ Delete')
                                .setStyle('DANGER')
                        )
                ],
            }).catch(err => {
                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`I don't have the required permissions to send messages in the suggestions log channel. Please contact an admin.`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }))
            });
        }

        msg.react("🟢");
        msg.react("🔴");

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Successfully left your suggestion. You can view it in ${channel}`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))
    }
}