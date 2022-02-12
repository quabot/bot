const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general.js');
const { noPermission } = require('../../embeds/config');

const { buttonsMemberU, buttonsBotLogs, buttonsVoiceJL, buttonsVoiceM, buttonsJoin, buttonsLeave, buttonsCreate, buttonsInvite, buttonsMessageU, buttonsMessageD, buttonsRoleC, buttonsRoleU, buttonsUpdate, buttonsEmojiU, buttonsEmoji } = require('../../interactions/events.js');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        transcriptChannelID: "none"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                }
            }).clone().catch(function (err) { console.log(err) });

            const Events = require('../../schemas/EventsSchema')
            const eventsDatabase = await Events.findOne({
                guildId: interaction.guild.id
            },
                (err, events) => {
                    if (err) console.error(err)
                    if (!events) {
                        const newEvents = new Events({
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                            joinMessages: true,
                            leaveMessages: true,
                            channelCreateDelete: true,
                            channelUpdate: true,
                            emojiCreateDelete: true,
                            emojiUpdate: true,
                            inviteCreateDelete: true,
                            messageDelete: true,
                            messageUpdate: true,
                            roleCreateDelete: true,
                            roleUpdate: true,
                            voiceState: false,
                            voiceMove: false,
                            memberUpdate: true,
                            quabotLogging: true
                        })
                        newEvents.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                        })
                        return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                    }
                }
            ).clone().catch(function (err) { console.log(err) });

            if (interaction.isSelectMenu()) {
                if (interaction.values[0] === "join_messages") {
                    const join = new MessageEmbed()
                        .setTitle("Toggle Join Messages")
                        .setDescription("Use the buttons to enable/disable the join messages (not leave).")
                        .addField("Currently", `${eventsDatabase.joinMessages}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [join], components: [buttonsJoin] }).catch(err => console.log("Error!"));
                }

                if (interaction.values[0] === "leave_messages") {
                    const leave = new MessageEmbed()
                        .setTitle("Toggle Leave Messages")
                        .setDescription("Use the buttons to enable/disable the leave messages (not join).")
                        .addField("Currently", `${eventsDatabase.leaveMessages}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [leave], components: [buttonsLeave] }).catch(err => console.log("Error!"));
                }

                if (interaction.values[0] === "channel_logging") {
                    const delcrea = new MessageEmbed()
                        .setTitle("Toggle Channel Delete & Create logs")
                        .setDescription("Use the buttons to enable/disable the create and delete logs.")
                        .addField("Currently", `${eventsDatabase.channelCreateDelete}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [delcrea], components: [buttonsCreate] }).catch(err => console.log("Error!"));
                }

                if (interaction.values[0] === "channel_updates") {
                    const update = new MessageEmbed()
                        .setTitle("Toggle Channel Update logs")
                        .setDescription("Use the buttons to enable/disable the channel update logs.")
                        .addField("Currently", `${eventsDatabase.channelUpdate}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [update], components: [buttonsUpdate] }).catch(err => console.log("Error!"));
                }
                
                if (interaction.values[0] === "emoji_cd") {
                    const emoji = new MessageEmbed()
                        .setTitle("Toggle Emoji Create & Delete logs")
                        .setDescription("Use the buttons to enable/disable the emoji c & d logs.")
                        .addField("Currently", `${eventsDatabase.emojiCreateDelete}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [emoji], components: [buttonsEmoji] }).catch(err => console.log("Error!"));
                }
                                
                if (interaction.values[0] === "emoji_update") {
                    const emojiU = new MessageEmbed()
                        .setTitle("Toggle Emoji Update logs")
                        .setDescription("Use the buttons to enable/disable the emoji update logs.")
                        .addField("Currently", `${eventsDatabase.emojiUpdate}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [emojiU], components: [buttonsEmojiU] }).catch(err => console.log("Error!"));
                }

                if (interaction.values[0] === "invite_cd") {
                    const inviteCD = new MessageEmbed()
                        .setTitle("Toggle Invite Creaction & Deletion logs")
                        .setDescription("Use the buttons to enable/disable the invite creation & deletion logs.")
                        .addField("Currently", `${eventsDatabase.inviteCreateDelete }`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [inviteCD], components: [buttonsInvite] }).catch(err => console.log("Error!"));
                }

                if (interaction.values[0] === "message_delete") {
                    const messageDelete = new MessageEmbed()
                        .setTitle("Toggle Message Delete logs")
                        .setDescription("Use the buttons to enable/disable the message delete logs.")
                        .addField("Currently", `${eventsDatabase.messageDelete }`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [messageDelete], components: [buttonsMessageD] }).catch(err => console.log("Error!"));
                }

                if (interaction.values[0] === "message_update") {
                    const messageUpdate = new MessageEmbed()
                        .setTitle("Toggle Message Update logs")
                        .setDescription("Use the buttons to enable/disable the message update logs.")
                        .addField("Currently", `${eventsDatabase.messageUpdate}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [messageUpdate], components: [buttonsMessageU] }).catch(err => console.log("Error!"));
                }

                
                if (interaction.values[0] === "role_create") {
                    const roleDeletUpdate = new MessageEmbed()
                        .setTitle("Toggle Role Creation & Deletion logs")
                        .setDescription("Use the buttons to enable/disable the role create & delete logs.")
                        .addField("Currently", `${eventsDatabase.roleCreateDelete}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [roleDeletUpdate], components: [buttonsRoleC] }).catch(err => console.log("Error!"));
                }

                if (interaction.values[0] === "role_update") {
                    const roleUpdate = new MessageEmbed()
                        .setTitle("Toggle Role Update logs")
                        .setDescription("Use the buttons to enable/disable the role update logs.")
                        .addField("Currently", `${eventsDatabase.roleUpdate}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [roleUpdate], components: [buttonsRoleU] }).catch(err => console.log("Error!"));
                }

                if (interaction.values[0] === "voice_join") {
                    const voicejoinLeave = new MessageEmbed()
                        .setTitle("Toggle Voice Join & leave logs")
                        .setDescription("Use the buttons to enable/disable the voice join & leave logs.")
                        .addField("Currently", `${eventsDatabase.voiceState}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [voicejoinLeave], components: [buttonsVoiceJL] }).catch(err => console.log("Error!"));
                }

                if (interaction.values[0] === "voice_move") {
                    const voiceMove = new MessageEmbed()
                        .setTitle("Toggle Voice Move logs")
                        .setDescription("Use the buttons to enable/disable the voice move logs.")
                        .addField("Currently", `${eventsDatabase.voiceMove}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [voiceMove], components: [buttonsVoiceM] }).catch(err => console.log("Error!"));
                }

                if (interaction.values[0] === "member_update") {
                    const memberUpdate = new MessageEmbed()
                        .setTitle("Toggle member update logs")
                        .setDescription("Use the buttons to enable/disable the member update logs. [nick, role given/removed]")
                        .addField("Currently", `${eventsDatabase.memberUpdate}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [memberUpdate], components: [buttonsMemberU] }).catch(err => console.log("Error!"));
                }

                if (interaction.values[0] === "log_bot") {
                    const quabotLog = new MessageEmbed()
                        .setTitle("Toggle Bot logs")
                        .setDescription("Use the buttons to enable/disable the bot logs.")
                        .addField("Currently", `${eventsDatabase.quabotLogging}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    interaction.reply({ ephemeral: true, embeds: [quabotLog], components: [buttonsBotLogs] }).catch(err => console.log("Error!"));
                }
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: clear`)] }).catch(err => console.log("Error!"));
            return;
        }
    }
}