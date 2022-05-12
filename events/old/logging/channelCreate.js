const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "channelCreate",
    async execute(channel, client) {
        if (channel.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: channel.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: channel.guild.id,
                        guildName: channel.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                    modEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "none",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(( err => { } ))
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(( err => { } ))
                }
            }).clone().catch(function (err) { console.log(err) });

            const Events = require('../../schemas/EventsSchema')
            const eventsDatabase = await Events.findOne({
                guildId: channel.guild.id
            }, (err, events) => {
                if (err) console.error(err)
                if (!events) {
                    const newEvents = new Events({
                        guildId: channel.guild.id,
                        guildName: channel.guild.name,
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
                        interaction.channel.send({ embeds: [error] }).catch(( err => { } ))
                    })
                    return interaction.channel.send({ embeds: [added] }).catch(( err => { } ))
                }
            }
            ).clone().catch(function (err) { console.log(err) });

            if (!eventsDatabase) return;
            if (!guildDatabase) return;

            const logChannel = channel.guild.channels.cache.get(guildDatabase.logChannelID);

            if (eventsDatabase.messageDelete === false) return;
            if (guildDatabase.logEnabled === "false") return;

            if (channel.type === "GUILD_TEXT") {
                if (guildDatabase.logEnabled === "true") {
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setColor(`GREEN`)
                            .setDescription(`<#${channel.id}>`)
                            .setTitle('<:channel:941403540352565259> Text Channel Created!')
                            .addField('Name', `${channel.name}`)
                            .addField('ID', `${channel.id}`)
                            
                        logChannel.send({ embeds: [embed] }).catch(( err => { } ))
                    };
                }
            }
            if (channel.type === "GUILD_NEWS") {
                if (guildDatabase.logEnabled === "true") {
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setColor(`GREEN`)
                            .setDescription(`<#${channel.id}>`)
                            .setTitle('<:ezgif:941408409469718569> Announcement Channel Created!')
                            .addField('Name', `${channel.name}`)
                            .addField('ID', `${channel.id}`)
                            
                        logChannel.send({ embeds: [embed] }).catch(( err => { } ))
                    };
                }
            }
            if (channel.type === "GUILD_STAGE_VOICE") {
                if (guildDatabase.logEnabled === "true") {
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setColor(`GREEN`)
                            .setDescription(`<#${channel.id}>`)
                            .setTitle('<:stage:941403540067340299> Stage Channel Created!')
                            .addField('Name', `${channel.name}`)
                            .addField('ID', `${channel.id}`)
                            
                        logChannel.send({ embeds: [embed] }).catch(( err => { } ))
                    };
                }
            }
            if (channel.type === "GUILD_CATEGORY") {
                if (guildDatabase.logEnabled === "true") {
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setColor(`GREEN`)
                            .setTitle('Category Created!')
                            .addField('Name', `${channel.name}`)
                            .addField('ID', `${channel.id}`)
                            
                        logChannel.send({ embeds: [embed] }).catch(( err => { } ))
                    };
                }
            }
            if (channel.type === "GUILD_VOICE") {
                if (guildDatabase.logEnabled === "true") {
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setColor(`GREEN`)
                            .setDescription(`<#${channel.id}>`)
                            .setTitle('<:ezgif:941408710008381530> Voice Channel Created!')
                            .addField('Name', `${channel.name}`)
                            .addField('ID', `${channel.id}`)
                            
                        logChannel.send({ embeds: [embed] }).catch(( err => { } ))
                    };
                }
            }
        } catch (e) {
            return;
        }
    }
}