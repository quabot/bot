const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Modal, TextInputComponent, Message } = require('discord.js');

module.exports = {
    id: "delete-suggestion",
    async execute(interaction, client, color) {

        await interaction.deferReply({ ephemeral: true });

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
        }).clone().catch(function (err) { });

        if (!guildDatabase) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Added this server to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))

        if (guildDatabase.suggestEnabled === "false") return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Suggestions are disabled in this server! Ask an admin to enable them with [the dashboard](http://localhost:3000).`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))

        const channel = interaction.guild.channels.cache.get(guildDatabase.suggestChannelID);
        if (!channel) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription("No suggestions channel setup! Configure this with [the dashboard](http://localhost:3000).")
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        const msgId = interaction.message.embeds[0].footer.text;
        channel.messages.fetch(`${msgId}`).then(message => {
            message.delete().catch((err => { }));
            interaction.followUp({

                embeds: [
                    new MessageEmbed()
                        .setDescription("Succesfully deleted that suggestion.")
                        .setColor(color)
                ], ephemeral: true

            })
        });

        interaction.message.edit({
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('delete-suggestion')
                            .setLabel(`Suggestion deleted by ${interaction.user.tag}`)
                            .setStyle('DANGER')
                            .setDisabled(true)
                    )
            ],
        }).catch((err => { }));

    }
}