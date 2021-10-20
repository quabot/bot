const discord = require('discord.js');
const mongoose = require('mongoose');
const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');

const { roleEmbed, channelEmbed, welcomeDisabled, welcomeEnabled, ticketDisabled, ticketEnabled, suggestEnabled, suggestDisabled1, toggleEmbed2, reportDisabled, reportEnabled, musicDisabled, musicEnabled, optionsEmbed, noPerms, toggleEmbed, levelsDisabled, levelsEnabled, logsDisabled, logsEnabled, swearDisabled, swearEnabled } = require('../../files/embeds');
const { role, channel, nextPage3, nextPage4, channel2, welcomeButtons, ticketButtons, suggestButtons, toggle2, nextPage2, nextPage1, reportButtons, musicButtons, selectCategory, disabledToggle, levelsButtons, toggle, logButtons, swearButtons } = require('../../files/interactions');

module.exports = {
    name: "config",
    description: "By using this command you will be able to change settings for your guild.",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const settings = await Guild.findOne({
            guildID: interaction.guild.id
        }, (err, guild) => {
            if (err) interaction.followUp({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    logChannelID: none,
                    enableLog: true,
                    enableSwearFilter: false,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: none,
                    suggestEnabled: true,
                    suggestChannelID: none,
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                    closedTicketCategoryName: "Closed Tickets",
                    welcomeEnabled: true,
                    welcomeChannelID: none,
                    enableNSFWContent: false,
                });

                newGuild.save()
                    .catch(err => interaction.followUp({ embeds: [errorMain] }));

                return interaction.followUp({ embeds: [addedDatabase] });
            }
        });

        interaction.reply({ ephemeral: true, embeds: [optionsEmbed], components: [selectCategory] });

        client.on('interactionCreate', async (interaction) => {
            const filter = m => interaction.user === author;
            const collector = interaction.channel.createMessageCollector({ time: 15000 });
            const mutedRole = new discord.MessageEmbed()
                .setTitle("Change Muted Role name")
                .setDescription("Enter the new name within 15 seconds to change it.")
                .addField("Current value", `${settings.mutedRoleName}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const mainRole = new discord.MessageEmbed()
                .setTitle("Change Main Role name")
                .setDescription("Enter the new name within 15 seconds to change it.")
                .addField("Current value", `${settings.mainRoleName}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");

            if (interaction.isSelectMenu()) {
                if (interaction.values[0] === "change_roles") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [roleEmbed], components: [role], ephemeral: true })
                }
                if (interaction.values[0] === "muted_role") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [mutedRole], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            if(m.author.bot) return;
                            if(m.content.lenght > 25) return;
                            await settings.updateOne({
                                mutedRoleName: m.content
                            });
                            const updated5 = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed muted role name to ${m.content}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated5]})
                            return;
                        } else {
                            if (m.author.bot) return;
                            const timedOu5t = new discord.MessageEmbed()
                                .setTitle("❌ Timed Out!")
                                .setDescription("You took too long to respond.")
                                .setColor(colors.COLOR)
                            m.reply({ embeds: [timedOu5t] });
                        }
                    });
                }
                if (interaction.values[0] === "main_role") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [mainRole], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            if(m.author.bot) return;
                            if(m.content.lenght > 25) return;
                            await settings.updateOne({
                                mainRoleName: m.content
                            });
                            const updated5 = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed main role name to ${m.content}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated5]})
                            return;
                        } else {
                            if (m.author.bot) return;
                            const timedOu5t = new discord.MessageEmbed()
                                .setTitle("❌ Timed Out!")
                                .setDescription("You took too long to respond.")
                                .setColor(colors.COLOR)
                            m.reply({ embeds: [timedOu5t] });
                        }
                    });
                }
            };
        })
        

        // CHANNELS
        client.on('interactionCreate', async (interaction) => {
            const filter = m => interaction.user === m.author;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });
            const logChannel = new discord.MessageEmbed()
                .setTitle("Change Logging Channel")
                .setDescription("Mention the new channel within 15 seconds to change it.")
                .addField("Current value", `<#${settings.logChannelID}>`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const reportChannel = new discord.MessageEmbed()
                .setTitle("Change Report Channel")
                .setDescription("Mention the new channel within 15 seconds to change it.")
                .addField("Current value", `<#${settings.reportChannelID}>`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const suugestChannel = new discord.MessageEmbed()
                .setTitle("Change Suggestions Channel")
                .setDescription("Mention the new channel within 15 seconds to change it.")
                .addField("Current value", `<#${settings.suggestChannelID}>`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const welcomeChannel = new discord.MessageEmbed()
                .setTitle("Change Welcome Messages Channel")
                .setDescription("Mention the new channel within 15 seconds to change it.")
                .addField("Current value", `<#${settings.welcomeChannelID}>`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const ticketChannel = new discord.MessageEmbed()
                .setTitle("Change Main Ticket Category name")
                .setDescription("Send the new channel name within 15 seconds to change it.")
                .addField("Current value", `${settings.ticketChannelName}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const CticketChannel = new discord.MessageEmbed()
                .setTitle("Change Closed Ticket Category Name")
                .setDescription("Send the new category name within 15 seconds to change it.")
                .addField("Current value", `${settings.closedTicketCategoryName}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");


            if (interaction.isSelectMenu()) {
                if (interaction.values[0] === "change_channels") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [channelEmbed], components: [channel, nextPage3], ephemeral: true })
                }
                if (interaction.values[0] === "log_channel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [logChannel], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            const C = m.mentions.channels.first();
                            if(!C) return;
                            await settings.updateOne({
                                logChannelID: C
                            });
                            const updated = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed log channel to ${C}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated]})
                            return;
                        } else {
                            if (m.author.bot) return;
                            const timedOut = new discord.MessageEmbed()
                                .setTitle("❌ Timed Out!")
                                .setDescription("You took too long to respond.")
                                .setColor(colors.COLOR)
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }
                if (interaction.values[0] === "report_channel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [reportChannel], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            const D = m.mentions.channels.first();
                            if(!D) return;
                            await settings.updateOne({
                                reportChannelID: D
                            });
                            const updated2 = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed report channel to ${D}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated2]})
                            return;
                        } else {
                            if (m.author.bot) return;
                            const timedOu2t = new discord.MessageEmbed()
                                .setTitle("❌ Timed Out!")
                                .setDescription("You took too long to respond.")
                                .setColor(colors.COLOR)
                            m.reply({ embeds: [timedOu2t] });
                        }
                    });
                }
                if (interaction.values[0] === "suggest_channel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [suugestChannel], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            const E = m.mentions.channels.first();
                            if(!E) return;
                            await settings.updateOne({
                                suggestChannelID: E
                            });
                            const updated3 = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed report channel to ${E}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated3]})
                            return;
                        } else {
                            if (m.author.bot) return;
                            const timedOu3t = new discord.MessageEmbed()
                                .setTitle("❌ Timed Out!")
                                .setDescription("You took too long to respond.")
                                .setColor(colors.COLOR)
                            m.reply({ embeds: [timedOu3t] });
                        }
                    });
                }
                if (interaction.values[0] === "welcome_channel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [welcomeChannel], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            const F = m.mentions.channels.first();
                            if(!F) return;
                            await settings.updateOne({
                                welcomeChannelID: F
                            });
                            const updated4 = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed report channel to ${F}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated4]})
                            return;
                        } else {
                            if (m.author.bot) return;
                            const timedOu4t = new discord.MessageEmbed()
                                .setTitle("❌ Timed Out!")
                                .setDescription("You took too long to respond.")
                                .setColor(colors.COLOR)
                            m.reply({ embeds: [timedOu4t] });
                        }
                    });
                }
                if (interaction.values[0] === "ticket_channel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [ticketChannel], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            if(m.author.bot) return;
                            if(m.content.lenght > 100) return;
                            await settings.updateOne({
                                ticketChannelName: m.content
                            });
                            const updated5 = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed tickets category to ${m.content}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated5]})
                            return;
                        } else {
                            if (m.author.bot) return;
                            const timedOu5t = new discord.MessageEmbed()
                                .setTitle("❌ Timed Out!")
                                .setDescription("You took too long to respond.")
                                .setColor(colors.COLOR)
                            m.reply({ embeds: [timedOu5t] });
                        }
                    });
                }
                if (interaction.values[0] === "closedticket_channel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [CticketChannel], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            if(m.author.bot) return;
                            if(m.content.lenght > 100) return;
                            await settings.updateOne({
                                closedTicketCategoryName: m.content
                            });
                            const updated5 = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed closed tickets category to ${m.content}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated5]})
                            return;
                        } else {
                            if (m.author.bot) return;
                            const timedOu5t = new discord.MessageEmbed()
                                .setTitle("❌ Timed Out!")
                                .setDescription("You took too long to respond.")
                                .setColor(colors.COLOR)
                            m.reply({ embeds: [timedOu5t] });
                        }
                    });
                }
            };

            if (interaction.isButton()) {
                if (interaction.customId === "next3") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ ephemeral: true, embeds: [channelEmbed], components: [channel2, nextPage4] });
                }
                if (interaction.customId === "next4") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ ephemeral: true, embeds: [channelEmbed], components: [channel, nextPage3] });
                }
            }
        })

        // TOGGLE SECTION
        client.on('interactionCreate', async (interaction) => {
            const toggleLevels = new discord.MessageEmbed()
                .setTitle("Toggle Levels")
                .setDescription("Use the buttons to enable/disable the levels system.")
                .addField("Current value", `${settings.enableLevel}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleLogs = new discord.MessageEmbed()
                .setTitle("Toggle Logs")
                .setDescription("Use the buttons to enable/disable guild events logging.")
                .addField("Current value", `${settings.enableLog}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleSwear = new discord.MessageEmbed()
                .setTitle("Toggle Swearfilter")
                .setDescription("Use the buttons to enable/disable the guild's swear filter.")
                .addField("Current value", `${settings.enableSwearFilter}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png"); 3
            const toggleMusic = new discord.MessageEmbed()
                .setTitle("Toggle Music")
                .setDescription("Use the buttons to enable/disable all music commands.")
                .addField("Current value", `${settings.enableMusic}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleReport = new discord.MessageEmbed()
                .setTitle("Toggle Reports")
                .setDescription("Use the buttons to enable/disable reporting for this guild.")
                .addField("Current value", `${settings.reportEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleSuggest = new discord.MessageEmbed()
                .setTitle("Toggle Suggestions")
                .setDescription("Use the buttons to enable/disable suggestions for this guild.")
                .addField("Current value", `${settings.suggestEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleTicket = new discord.MessageEmbed()
                .setTitle("Toggle Tickets")
                .setDescription("Use the buttons to enable/disable tickets for this guild.")
                .addField("Current value", `${settings.ticketEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleWelcome = new discord.MessageEmbed()
                .setTitle("Toggle Welcome Messages")
                .setDescription("Use the buttons to enable/disable welcome messages for this guild.")
                .addField("Current value", `${settings.welcomeEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            if (interaction.isSelectMenu()) {
                if (interaction.values[0] === "toggle_features") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [toggleEmbed], components: [toggle, nextPage1], ephemeral: true })
                }
                if (interaction.values[0] === "levels_toggle") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ ephemeral: true, embeds: [toggleLevels], components: [levelsButtons] })
                }
                if (interaction.values[0] === "log_toggle") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ ephemeral: true, embeds: [toggleLogs], components: [logButtons] })
                }
                if (interaction.values[0] === "swear_toggle") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ ephemeral: true, embeds: [toggleSwear], components: [swearButtons] })
                }
                if (interaction.values[0] === "music_toggle") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ ephemeral: true, embeds: [toggleMusic], components: [musicButtons] });
                }
                if (interaction.values[0] === "report_toggle") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ ephemeral: true, embeds: [toggleReport], components: [reportButtons] });
                }
                if (interaction.values[0] === "suggest_toggle") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ ephemeral: true, embeds: [toggleSuggest], components: [suggestButtons] });
                }
                if (interaction.values[0] === "tickets_toggle") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ ephemeral: true, embeds: [toggleTicket], components: [ticketButtons] });
                }
                if (interaction.values[0] === "welcome_toggle") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ ephemeral: true, embeds: [toggleWelcome], components: [welcomeButtons] });
                }
            };

            if (interaction.isButton()) {
                if (interaction.customId === "enableLevel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        enableLevel: true
                    });
                    interaction.update({ ephemeral: true, embeds: [levelsEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableLevel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        enableLevel: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [levelsDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enableLogs") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        enableLog: true
                    });
                    interaction.update({ ephemeral: true, embeds: [logsEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableLogs") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        enableLog: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [logsDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enableSwear") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        enableSwearFilter: true
                    });
                    interaction.update({ ephemeral: true, embeds: [swearEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableSwear") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        enableSwearFilter: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [swearDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enableMusic") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        enableMusic: true
                    });
                    interaction.update({ ephemeral: true, embeds: [musicEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableMusic") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        enableMusic: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [musicDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enableReport") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        reportEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [reportEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableReport") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        reportEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [reportDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enableSuggest") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        suggestEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [suggestEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableSuggest") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        suggestEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [suggestDisabled1], components: [disabledToggle] });
                }
                if (interaction.customId === "enableTicket") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        ticketEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [ticketEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableTicket") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        ticketEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [ticketDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enableWelcome") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        welcomeEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [welcomeEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableWelcome") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await settings.updateOne({
                        welcomeEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [welcomeDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "next1") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ ephemeral: true, embeds: [toggleEmbed2], components: [toggle2, nextPage2] });
                }
                if (interaction.customId === "next2") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ ephemeral: true, embeds: [toggleEmbed], components: [toggle, nextPage1] });
                }
            }
        })
    }
}