const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require("discord.js");

module.exports = {
    value: "logging_events",
    permission: "ADMINISTRATOR",
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
                    suggestChannelID: "none",
                    welcomeChannelID: "none",
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
                        message.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                    });
            }
        }).clone().catch(function (err) { console.log(err) });

        if (!guildDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Added this server to the database, please run that command again.`)
            ]
        }).catch((err => { }));

        const Log = require('../../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: interaction.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: interaction.guild.id,
                    emojiCreateDelete: true,
                    emojiUpdate: true,
                    guildBanAdd: true,
                    guildBanRemove: true,
                    roleAddRemove: true,
                    nickChange: true,
                    boost: true,
                    guildUpdate: true,
                    inviteCreateDelete: true,
                    messageDelete: true,

                    messageUpdate: true,
                    roleCreateDelete: true,
                    roleUpdate: true,
                    stickerCreateDelete: true,
                    stickerUpdate: true,
                    threadCreateDelete: true,
                    voiceMove: false,
                    voiceJoinLeave: false,
                });
                newLog.save()
                    .catch(err => {
                        console.log(err);
                    });
            }
        }).clone().catch(function (err) { console.log(err) });

        if (!logDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Added this server to the database, please run that command again.`)
            ]
        }).catch((err => { }));

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Toggle Events")
                    .setDescription("Toggle events from logging in the main logging channel. Click the events you want enabled in the select menu below this message, it will be updated automatically.")
                    .setColor(color)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
            ], ephemeral: true, components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('events')
                            .setMinValues(0)
                            .setMaxValues(18)
                            .setPlaceholder('Select the events you wish to enable.')
                            .addOptions([
                                {
                                    label: 'Ban Add',
                                    description: 'Log when a user gets banned.',
                                    value: 'guildBanAdd',
                                    default: logDatabase.enabled.includes("guildBanAdd")
                                },
                                {
                                    label: 'Ban Remove',
                                    description: 'Log when a user gets unbanned.',
                                    value: 'guildBanRemove',
                                    default: logDatabase.enabled.includes("guildBanRemove")
                                },
                                {
                                    label: 'Emoji Create Delete',
                                    description: 'Log when new emojis are created and deleted.',
                                    value: 'emojiCreateDelete',
                                    default: logDatabase.enabled.includes("emojiCreateDelete")
                                },
                                {
                                    label: 'Emoji Update',
                                    description: 'Log when emoji names are changed.',
                                    value: 'emojiUpdate',
                                    default: logDatabase.enabled.includes("emojiUpdate")
                                },
                                {
                                    label: 'Role add & remove',
                                    description: 'Log when roles of users get removed and added.',
                                    value: 'roleAddRemove',
                                    default: logDatabase.enabled.includes("roleAddRemove")
                                },
                                {
                                    label: 'Nickname change',
                                    description: 'Log when a user\'s nickname is changed.',
                                    value: 'nickChange',
                                    default: logDatabase.enabled.includes("nickChange")
                                },
                                {
                                    label: 'Boosts',
                                    description: 'Log when the server get\'s boosted.',
                                    value: 'boost',
                                    default: logDatabase.enabled.includes("boost")
                                },
                                {
                                    label: 'Server Updates',
                                    description: 'Log when the server get\'s changed/updated.',
                                    value: 'guildUpdate',
                                    default: logDatabase.enabled.includes("guildUpdate")
                                },
                                {
                                    label: 'Invite Create & Delete',
                                    description: 'Log when invites get created/deleted.',
                                    value: 'inviteCreateDelete',
                                    default: logDatabase.enabled.includes("inviteCreateDelete")
                                },
                                {
                                    label: 'Message Delete',
                                    description: 'Log when messages are deleted.',
                                    value: 'messageDelete',
                                    default: logDatabase.enabled.includes("messageDelete")
                                },
                                {
                                    label: 'Message Updates',
                                    description: 'Log when messages are edited.',
                                    value: 'messageUpdate',
                                    default: logDatabase.enabled.includes("messageUpdate")
                                },
                                {
                                    label: 'Role Create & Delete',
                                    description: 'Log when roles are created & deleted.',
                                    value: 'roleCreateDelete',
                                    default: logDatabase.enabled.includes("roleCreateDelete")
                                },
                                {
                                    label: 'Role Update',
                                    description: 'Log when roles are edited.',
                                    value: 'roleUpdate',
                                    default: logDatabase.enabled.includes("roleUpdate")
                                },
                                {
                                    label: 'Sticker Create & Delete',
                                    description: 'Log when stickers are created/deleted.',
                                    value: 'stickerCreateDelete',
                                    default: logDatabase.enabled.includes("stickerCreateDelete")
                                },
                                {
                                    label: 'Sticker Updates',
                                    description: 'Log when stickers are updated.',
                                    value: 'stickerUpdate',
                                    default: logDatabase.enabled.includes("stickerUpdate")
                                },
                                {
                                    label: 'Thread Create & Delete',
                                    description: 'Log when threads are created/delted.',
                                    value: 'threadCreateDelete',
                                    default: logDatabase.enabled.includes("threadCreateDelete")
                                },
                                {
                                    label: 'Voice Move',
                                    description: 'Log when users switch voice channels.',
                                    value: 'voiceMove',
                                    default: logDatabase.enabled.includes("voiceMove")
                                },
                                {
                                    label: 'Voice Join & Leave',
                                    description: 'Log when users join & leave voice channels.',
                                    value: 'voiceJoinLeave',
                                    default: logDatabase.enabled.includes("voiceJoinLeave")
                                },
                            ]),
                    )
            ]
        }).catch(( err => { } ));
    }
}