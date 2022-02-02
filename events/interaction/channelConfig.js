const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');

const { noPermission, timedOut } = require('../../files/embeds/config');
const { buttonsLevel } = require('../../files/interactions/config');
const { errorMain, addedDatabase } = require('../../files/embeds.js');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

        try {
            const filter = m => interaction.user === m.author;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

            const Guild = require('../../schemas/GuildSchema')
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id
            },
                (err, guild) => {
                    if (err) console.error(err)
                    if (!guild) {
                        const newGuild = new Guild({
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                            logChannelID: 'none',
                            reportChannelID: 'none',
                            suggestChannelID: 'none',
                            welcomeChannelID: 'none',
                            levelChannelID: 'none',
                            pollChannelID: 'none',
                            ticketCategory: 'Tickets',
                            closedTicketCategory: 'Tickets',
                            logEnabled: true,
                            musicEnabled: true,
                            levelEnabled: false,
                            reportEnabled: true,
                            suggestEnabled: true,
                            ticketEnabled: true,
                            welcomeEnabled: true,
                            pollsEnabled: true,
                            roleEnabled: true,
                            mainRole: 'Member',
                            mutedRole: 'Muted',
                            joinMessage: "Welcome {user} to **{guild-name}**!",
                            swearEnabled: false,
transcriptChannelID: "none"
                        })
                        newGuild.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            );

            if (interaction.isSelectMenu()) {
                if (interaction.values[0] === "log_channel") {

                    const log = new MessageEmbed()
                        .setTitle("Change Logging Channel")
                        .setDescription("Mention the new channel within 15 seconds to change it.")
                        .addField("Current value", `<#${guildDatabase.logChannelID}>`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [log], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            const C = m.mentions.channels.first();
                            if (!C) return;

                            await guildDatabase.updateOne({
                                logChannelID: C
                            });

                            const updated = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed log channel to ${C}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated] })

                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }

                if (interaction.values[0] === "levelup_channel") {

                    const level = new MessageEmbed()
                        .setTitle("Change Level Up Message Channel Name")
                        .setDescription("Mention the new channel within 15 seconds to change it, or click the button to disable this channel, level up messages would then be sent in the channel the user is in at that time.")
                        .addField("Current value", `${guildDatabase.levelChannelID}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ ephemeral: true, embeds: [level], components: [buttonsLevel] });
                    collector.on('collect', async m => {
                        if (m) {
                            const D = m.mentions.channels.first();
                            if (!D) return;
                            await guildDatabase.updateOne({
                                levelChannelID: D
                            });
                            const updated2 = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed level up channel to ${D}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated2] })
                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }

                if (interaction.values[0] === "report_channel") {

                    const report = new MessageEmbed()
                        .setTitle("Change Report Channel")
                        .setDescription("Mention the new channel within 15 seconds to change it.")
                        .addField("Current value", `<#${guildDatabase.reportChannelID}>`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [report], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            const D = m.mentions.channels.first();
                            if (!D) return;
                            await guildDatabase.updateOne({
                                reportChannelID: D
                            });

                            const updated2 = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed report channel to ${D}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated2] })

                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }

                if (interaction.values[0] === "suggest_channel") {

                    const suggest = new MessageEmbed()
                        .setTitle("Change Suggestions Channel")
                        .setDescription("Mention the new channel within 15 seconds to change it.")
                        .addField("Current value", `<#${guildDatabase.suggestChannelID}>`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [suggest], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            const E = m.mentions.channels.first();
                            if (!E) return;
                            await guildDatabase.updateOne({
                                suggestChannelID: E
                            });
                            const updated3 = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed suggestions channel to ${E}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated3] })
                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }

                if (interaction.values[0] === "welcome_channel") {

                    const welcome = new MessageEmbed()
                        .setTitle("Change Welcome Messages Channel")
                        .setDescription("Mention the new channel within 15 seconds to change it.")
                        .addField("Current value", `<#${guildDatabase.welcomeChannelID}>`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [welcome], ephemeral: true });

                    collector.on('collect', async m => {
                        if (m) {
                            const F = m.mentions.channels.first();
                            if (!F) return;
                            await guildDatabase.updateOne({
                                welcomeChannelID: F
                            });
                            const updated4 = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed welcome channel to ${F}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated4] })
                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }
                if (interaction.values[0] === "transcript_channel") {

                    const transcript = new MessageEmbed()
                        .setTitle("Change Transcripts Channel")
                        .setDescription("Mention the new channel within 15 seconds to change it.")
                        .addField("Current value", `<#${guildDatabase.transcriptChannelID}>`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [transcript], ephemeral: true });

                    collector.on('collect', async m => {
                        if (m) {
                            const F = m.mentions.channels.first();
                            if (!F) return;
                            await guildDatabase.updateOne({
                                transcriptChannelID: F
                            });
                            const updated42 = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed transcript logging channel to ${F}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated42] })
                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }

                if (interaction.values[0] === "ticket_channel") {

                    const ticket = new MessageEmbed()
                        .setTitle("Change Main Ticket Category name")
                        .setDescription("Send the new channel name within 15 seconds to change it.")
                        .addField("Current value", `${guildDatabase.ticketCategory}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [ticket], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            if (m.author.bot) return;
                            if (m.content.lenght > 100) return;
                            await guildDatabase.updateOne({
                                ticketCategory: m.content
                            });
                            const updated5 = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed tickets category to ${m.content}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated5] })
                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }

                if (interaction.values[0] === "closedticket_channel") {

                    const closed = new MessageEmbed()
                        .setTitle("Change Closed Ticket Category Name")
                        .setDescription("Send the new category name within 15 seconds to change it.")
                        .addField("Current value", `${guildDatabase.closedTicketCategory}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [closed], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            if (m.author.bot) return;
                            if (m.content.lenght > 100) return;
                            await guildDatabase.updateOne({
                                closedTicketCategory: m.content
                            });
                            const updated5 = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed closed tickets category to ${m.content}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated5] })
                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }

                if (interaction.values[0] === "poll_channel") {

                    const poll = new MessageEmbed()
                        .setTitle("Change Poll Messages channel")
                        .setDescription("Mention the new channel within 15 seconds to change it.")
                        .addField("Current value", `<#${guildDatabase.pollChannelID}>`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [poll], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            const C = m.mentions.channels.first();
                            if (!C) return;
                            await guildDatabase.updateOne({
                                pollChannelID: C
                            });
                            const updated = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed poll channel to ${C}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated] })
                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }
            }

        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}