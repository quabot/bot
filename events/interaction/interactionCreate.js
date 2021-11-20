const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const consola = require('consola');
const discord = require('discord.js');
const { meme } = require('memejs');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const { commands } = require('../../index');

const { CatScanning, addedDatabase, DogScanning, ticketsDisabled, MemeScanning } = require('../../files/embeds');
const { closeTicket, reopenButton, ticketButton, deleteTicket, newMeme, newCat, newDog } = require('../../files/interactions');
const { disabledLevelUp, roleEmbed, channelEmbed, welcomeDisabled, welcomeEnabled, ticketDisabled, ticketEnabled, suggestEnabled, suggestDisabled1, toggleEmbed2, reportDisabled, reportEnabled, musicDisabled, musicEnabled, errorMain, optionsEmbed, noPerms, toggleEmbed, levelsDisabled, levelsEnabled, logsDisabled, logsEnabled, swearDisabled, swearEnabled } = require('../../files/embeds');
const { role, channel, nextPage3, nextPage4, channel2, welcomeButtons, ticketButtons, suggestButtons, toggle2, nextPage2, nextPage1, reportButtons, musicButtons, selectCategory, disabledToggle, levelsButtons, toggle, logButtons, swearButtons, disableLevel } = require('../../files/interactions');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            consola.info(`/${command.name} was used.`)
            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(colors.RED)
                        .setTitle("⛔ An error occured while trying to run this command!")
                ]
            }) && client.commands.delete(interaction.commandName);

            command.execute(client, interaction);

        }

        const settings = await Guild.findOne({
            guildID: interaction.guild.id
        }, (err, guild) => {
            if (err) interaction.reply({ embeds: [errorMain] });
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
                    .catch(err => interaction.reply({ embeds: [errorMain] }));

                return interaction.reply({ embeds: [addedDatabase] });
            }
        });

        if (interaction.isButton()) {
            if (interaction.customId === "meme") {
                const subreddits = ['meme', 'memes', 'dankmemes']
                const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
                if (subreddit === "meme") {
                    interaction.reply({ embeds: [MemeScanning] })
                    meme('meme', function (err, data) {
                        if (err) return interaction.editReply({ embeds: [errorMain] });
                        const embed = new discord.MessageEmbed()
                            .setTitle(`${data.title}`)
                            .setColor(colors.COLOR)
                            .setURL(data.url)
                            .setImage(`${data.url}`)
                            .setFooter(`r/${data.subreddit} - u/${data.author}`)
                            .setTimestamp('Created ' + data.created)
                        interaction.editReply({ embeds: [embed], components: [newMeme] });
                    });
                } else if (subreddit === "memes") {
                    interaction.reply({ embeds: [MemeScanning] })
                    meme('memes', function (err, data) {
                        if (err) return interaction.editReply({ embeds: [errorMain] });
                        const embed = new discord.MessageEmbed()
                            .setTitle(`${data.title}`)
                            .setColor(colors.COLOR)
                            .setURL(data.url)
                            .setImage(`${data.url}`)
                            .setFooter(`r/${data.subreddit} - u/${data.author}`)
                            .setTimestamp('Created ' + data.created)
                        interaction.editReply({ embeds: [embed], components: [newMeme] });
                    });
                } else if (subreddit === "dankmemes") {
                    interaction.reply({ embeds: [MemeScanning] })
                    meme('dankmemes', function (err, data) {
                        if (err) return interaction.editReply({ embeds: [errorMain] });
                        const embed = new discord.MessageEmbed()
                            .setTitle(`${data.title}`)
                            .setColor(colors.COLOR)
                            .setURL(data.url)
                            .setImage(`${data.url}`)
                            .setFooter(`r/${data.subreddit} - u/${data.author}`)
                            .setTimestamp('Created ' + data.created)
                        interaction.editReply({ embeds: [embed], components: [newMeme] });
                    });
                }
            }
            if (interaction.customId === "cat") {
                interaction.reply({ embeds: [CatScanning] })
                meme('cats', function (err, data) {
                    if (err) return interaction.followUp({ embeds: [errorMain] });
                    const embed = new MessageEmbed()
                        .setTitle(`Here is your cat! :cat:`)
                        .setColor(colors.COLOR)
                        .setImage(`${data.url}`)
                        .setURL(data.url)
                        .setFooter(`r/${data.subreddit}`)
                        .setTimestamp('Created ' + data.created)
                    interaction.editReply({ embeds: [embed], components: [newCat] });
                });

            }
            if (interaction.customId === "dog") {
                interaction.reply({ embeds: [DogScanning] })
                meme('dogpics', function (err, data) {
                    if (err) return interaction.followUp({ embeds: [errorMain] });
                    const embed = new MessageEmbed()
                        .setTitle(`Here is your dog! :dog:`)
                        .setColor(colors.COLOR)
                        .setImage(`${data.url}`)
                        .setURL(data.url)
                        .setFooter(`r/${data.subreddit}`)
                        .setTimestamp('Created ' + data.created)
                    interaction.editReply({ embeds: [embed], components: [newDog] });
                });
            }
            if (interaction.customId === "close") {
                if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply("You are not the ticket owner and/or do not have the `KICK_MEMBERS` permission.")
                }
                if (settings.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
                const closeEmbed = new MessageEmbed()
                    .setColor(colors.TICKET_CLOSING)
                    .setTitle("Closing ticket...")
                    .setDescription("Reopen this ticket using the buttons below this message!")
                    .setTimestamp()
                interaction.reply({ embeds: [closeEmbed], components: [reopenButton] });

                // check name for closed category
                let CticketsCatName = settings.closedTicketCategoryName;
                if (CticketsCatName === "undefined") {
                    let CticketsCatName = "Closed Tickets";
                }

                // find the closed category
                let closedCategory = interaction.guild.channels.cache.find(cat => cat.name === CticketsCatName);

                // Create/check for closed category
                if (closedCategory === undefined) {
                    interaction.reply("the closed category does not exist, creating one now...");
                    interaction.guild.channels.create(CticketsCatName, { type: "GUILD_CATEGORY" });
                    return interaction.channel.send(":white_check_mark: Succes! Please run the command again to create your ticket.")
                }

                interaction.channel.setParent(closedCategory);
                interaction.channel.permissionOverwrites.edit(interaction.user, {
                    SEND_MESSAGES: false,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true
                });
            }
            if (interaction.customId === "cancel") {
                if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply("You are not the ticket owner and/or do not have the `KICK_MEMBERS` permission.")
                }
                const cancelEmbed = new MessageEmbed()
                    .setColor(colors.TICKET_CLOSING)
                    .setTitle(":x: Cancelled!")
                    .setDescription("Cancelled the deleting/closing of this ticket.")
                    .setTimestamp()
                interaction.reply({ embeds: [cancelEmbed] });
            }
            if (interaction.customId === "cancelclose") {
                if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply("You are not the ticket owner and/or do not have the `KICK_MEMBERS` permission.")
                }
                const cancelEmbed = new MessageEmbed()
                    .setColor(colors.TICKET_CLOSING)
                    .setTitle(":x: Cancelled!")
                    .setDescription("Cancelled the deleting/closing of this ticket.")
                    .setTimestamp()
                interaction.reply({ embeds: [cancelEmbed] });
            }
            if (interaction.customId === "deleteconfirm") {
                const deleting = new MessageEmbed()
                    .setColor(colors.TICKET_DELETE)
                    .setTitle("Ticket deleting...")
                    .setDescription("Ticket will be deleted, this cannot be reverted.")
                    .setTimestamp()
                interaction.reply({ embeds: [deleting] });
                setTimeout(() => {
                    interaction.channel.delete()
                }, 2000);
            }
            if (interaction.customId === "delete") {
                if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply("You are not the ticket owner and/or do not have the `KICK_MEMBERS` permission.")
                }
                const sureDelete = new MessageEmbed()
                    .setColor(colors.TICKET_CLOSING)
                    .setTitle("Are you sure you want to delete this ticket?")
                    .setDescription("This cannot be reverted.")
                    .setTimestamp()
                interaction.reply({ embeds: [sureDelete], components: [deleteTicket] });
            }
            if (interaction.customId === "ticketmsg") {
                const ticketMsg = new MessageEmbed()
                    .setColor(colors.TICKET_CREATED)
                    .setTitle("Create a ticket!")
                    .setDescription("React with the button below this message to create a ticket!")
                    .setTimestamp()
                interaction.reply("** **");
                interaction.deleteReply()
                interaction.channel.send({ embeds: [ticketMsg], components: [ticketButton] });
            }
            if (interaction.customId === "ticket") {
                let ticketsCatName = settings.ticketChannelName;
                let CticketsCatName = settings.closedTicketCategoryName;

                const topic = `No topic given.`;

                if (ticketsCatName === "undefined") {
                    let ticketsCatName = "Tickets";
                }

                if (CticketsCatName === "undefined") {
                    let CticketsCatName = "Closed Tickets";
                }

                let category = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);
                let closedCategory = interaction.guild.channels.cache.find(cat => cat.name === CticketsCatName);
                if (category === undefined) {
                    const embedTicketsCreate = new discord.MessageEmbed()
                        .setColor(colors.TICKET_CREATED)
                        .setTitle("Creating a category!")
                        .setDescription("The tickets categegory does not exist. Creating one now...")
                        .setTimestamp()
                    interaction.reply({ ephemeral: true, embeds: [embedTicketsCreate] });
                    interaction.guild.channels.create(ticketsCatName, { type: "GUILD_CATEGORY" });
                    if (closedCategory === undefined) {
                        const embedCTicketsCreate = new discord.MessageEmbed()
                            .setColor(colors.TICKET_CREATED)
                            .setTitle("Creating a category!")
                            .setDescription("The categegory for closed tickets does not exist. Creating one now...")
                            .setTimestamp()
                        interaction.followUp({ ephemeral: true, embeds: [embedCTicketsCreate] });
                        interaction.guild.channels.create(CticketsCatName, { type: "GUILD_CATEGORY" });
                    }
                    const succesCreate = new discord.MessageEmbed()
                        .setColor(colors.TICKET_CREATED)
                        .setTitle("Created category!")
                        .setDescription("Succesfully created the required category(ies), run the command again.")
                        .setTimestamp()
                    return interaction.followUp({ ephemeral: true, embeds: [succesCreate] });
                }
                if (closedCategory === undefined) {
                    const succesCreate = new discord.MessageEmbed()
                        .setColor(colors.COLOR)
                        .setTitle("Created category!")
                        .setDescription("Succesfully created the required category(ies), run the command again.")
                        .setTimestamp()
                    const embedCTicketsCreate = new discord.MessageEmbed()
                        .setColor(colors.COLOR)
                        .setTitle("Creating category!")
                        .setDescription("The categegory for closed tickets does not exist. Creating one now...")
                        .setTimestamp()
                    interaction.reply({ ephemeral: true, embeds: [embedCTicketsCreate] });
                    interaction.guild.channels.create(CticketsCatName, { type: "GUILD_CATEGORY" });
                    return interaction.followUp({ ephemeral: true, embeds: [succesCreate] });
                }

                let ticketChannel = interaction.guild.channels.cache.find(channel => channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}`);

                if (ticketChannel === undefined) {

                    interaction.guild.channels.create(`${interaction.user.username}-${interaction.user.discriminator}`, { parent: category, topic: `Creator: ${interaction.user.username}#${interaction.user.discriminator} - Topic: ${topic}` }).then(ch => {
                        const embed = new discord.MessageEmbed()
                            .setColor(colors.TICKET_CREATED)
                            .setTitle("Created your ticket :white_check_mark:")
                            .setDescription("You can find it here: <#" + ch + ">")
                            .addField("Topic", `${topic}`)
                            .setTimestamp()
                        interaction.reply({ ephemeral: true, embeds: [embed] })
                    });

                    setTimeout(() => {
                        let ticketChannel2 = interaction.guild.channels.cache.find(channel => channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}`);
                        ticketChannel2.permissionOverwrites.edit(interaction.user, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true
                        });
                        const createdSucces = new discord.MessageEmbed()
                            .setColor(colors.TICKET_CREATED)
                            .setTitle("Ticket Created!")
                            .setDescription(`Welcome to your ticket, ${interaction.user}!\nPlease wait here, staff will be with you shortly.`)
                            .addField(`Creator`, `${interaction.user}`)
                            .addField(`Topic`, `${topic}`)
                            .setTimestamp()
                            .setFooter(`Made a mistake? Close this ticket using the buttons below this message.`)
                        ticketChannel2.send({ embeds: [createdSucces], components: [closeTicket] });
                        ticketChannel2.send(`${interaction.user}`).then(m => {
                            setTimeout(() => {
                                m.delete()
                            }, 200);
                        });
                    }, 1000);

                } else {
                    interaction.reply({ ephemeral: true, content: "You already have a ticket! You can find it here: <#" + ticketChannel + ">! If this ticket is closed, reopen it using /reopen <#" + ticketChannel + ">, or by clicking the button." });
                    return
                }
            }
            if (interaction.customId === "reopen") {
                if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply("You are not the ticket owner and/or do not have the `KICK_MEMBERS` permission.")
                }
                if (settings.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
                const reopenEmbed = new MessageEmbed()
                    .setColor(colors.TICKET_CLOSING)
                    .setTitle("Re-opening ticket...")
                    .setDescription("Close or delete this ticket using the buttons below this message!")
                    .setTimestamp()
                interaction.reply({ embeds: [reopenEmbed], components: [closeTicket] });

                // check name for closed category
                let ticketsCatName = settings.ticketChannelName;
                if (ticketsCatName === "undefined") {
                    let ticketsCatName = "Tickets";
                }

                // find the closed category
                let Category = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);

                // Create/check for closed category
                if (Category === undefined) {
                    interaction.reply("The tickets category does not exist, creating one now...");
                    interaction.guild.channels.create(ticketsCatName, { type: "GUILD_CATEGORY" });
                    return interaction.channel.send(":white_check_mark: Succes! Please run the command again to create your ticket.")
                }

                interaction.channel.setParent(Category);
                interaction.channel.permissionOverwrites.edit(interaction.user, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true
                });
            }
        }
        if (interaction.isSelectMenu()) {
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
            if (interaction.values[0] === "change_roles") {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                interaction.reply({ embeds: [roleEmbed], components: [role], ephemeral: true })
            }
            if (interaction.values[0] === "muted_role") {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                interaction.reply({ embeds: [mutedRole], ephemeral: true });
                collector.on('collect', async m => {
                    if (m) {
                        if (m.author.bot) return;
                        if (m.content.lenght > 25) return;
                        await settings.updateOne({
                            mutedRoleName: m.content
                        });
                        const updated5 = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Succes!")
                            .setDescription(`Changed muted role name to ${m.content}!`)
                            .setColor(colors.COLOR)
                        m.channel.send({ embeds: [updated5] })
                        collector.stop();
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
                        if (m.author.bot) return;
                        if (m.content.lenght > 25) return;
                        await settings.updateOne({
                            mainRoleName: m.content
                        });
                        const updated5 = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Succes!")
                            .setDescription(`Changed main role name to ${m.content}!`)
                            .setColor(colors.COLOR)
                        m.channel.send({ embeds: [updated5] })
                        collector.stop();
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

        const filter = m => interaction.user === m.author;
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

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
        const levelUpEmbed = new discord.MessageEmbed()
            .setTitle("Change Level Up Message Channel Name")
            .setDescription("Mention the new channel within 15 seconds to change it, or click the button to disable this channel, level up messages would then be sent in the channel the user is in at that time.")
            .addField("Current value", `${settings.levelUpChannelID}`)
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
                        if (!C) return;
                        await settings.updateOne({
                            logChannelID: C
                        });
                        const updated = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Succes!")
                            .setDescription(`Changed log channel to ${C}!`)
                            .setColor(colors.COLOR)
                        m.channel.send({ embeds: [updated] })
                        collector.stop();
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
            if (interaction.values[0] === "levelup_channel") {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                interaction.reply({ embeds: [levelUpEmbed], components: [disableLevel], ephemeral: true });
                collector.on('collect', async m => {
                    if (m) {
                        const D = m.mentions.channels.first();
                        if (!D) return;
                        await settings.updateOne({
                            levelUpChannelID: D
                        });
                        const updated2 = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Succes!")
                            .setDescription(`Changed level up channel to ${D}!`)
                            .setColor(colors.COLOR)
                        m.channel.send({ embeds: [updated2] })
                        collector.stop();
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
            if (interaction.values[0] === "report_channel") {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                interaction.reply({ embeds: [reportChannel], ephemeral: true });
                collector.on('collect', async m => {
                    if (m) {
                        const D = m.mentions.channels.first();
                        if (!D) return;
                        await settings.updateOne({
                            reportChannelID: D
                        });
                        const updated2 = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Succes!")
                            .setDescription(`Changed report channel to ${D}!`)
                            .setColor(colors.COLOR)
                        m.channel.send({ embeds: [updated2] })
                        collector.stop();
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
                        if (!E) return;
                        await settings.updateOne({
                            suggestChannelID: E
                        });
                        const updated3 = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Succes!")
                            .setDescription(`Changed report channel to ${E}!`)
                            .setColor(colors.COLOR)
                        m.channel.send({ embeds: [updated3] })
                        collector.stop();
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
                        if (!F) return;
                        await settings.updateOne({
                            welcomeChannelID: F
                        });
                        const updated4 = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Succes!")
                            .setDescription(`Changed report channel to ${F}!`)
                            .setColor(colors.COLOR)
                        m.channel.send({ embeds: [updated4] })
                        collector.stop();
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
                        if (m.author.bot) return;
                        if (m.content.lenght > 100) return;
                        await settings.updateOne({
                            ticketChannelName: m.content
                        });
                        const updated5 = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Succes!")
                            .setDescription(`Changed tickets category to ${m.content}!`)
                            .setColor(colors.COLOR)
                        m.channel.send({ embeds: [updated5] })
                        collector.stop();
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
                        if (m.author.bot) return;
                        if (m.content.lenght > 100) return;
                        await settings.updateOne({
                            closedTicketCategoryName: m.content
                        });
                        const updated5 = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Succes!")
                            .setDescription(`Changed closed tickets category to ${m.content}!`)
                            .setColor(colors.COLOR)
                        m.channel.send({ embeds: [updated5] })
                        collector.stop();
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
            if (interaction.customId === "disablelevel") {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                interaction.update({ ephemeral: true, embeds: [disabledLevelUp] });
                await settings.updateOne({
                    levelUpChannelID: "none"
                });

            }
        }
    }
}