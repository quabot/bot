const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const consola = require('consola');
const discord = require('discord.js');
const quiz = require('../../validation/quiz.json');
const { meme } = require('memejs');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const { commands } = require('../../index');

const { CatScanning, addedDatabase, DogScanning, ticketsDisabled, MemeScanning, notATicket } = require('../../files/embeds');
const { closeTicket, reopenButton, ticketButton, deleteTicket, newMeme, newCat, newDog } = require('../../files/interactions');
const { disabledLevelUp, roleEmbed, channelEmbed, welcomeDisabled, welcomeEnabled, ticketDisabled, ticketEnabled, suggestEnabled, suggestDisabled1, toggleEmbed2, reportDisabled, reportEnabled, musicDisabled, musicEnabled, errorMain, optionsEmbed, noPerms, toggleEmbed, levelsDisabled, levelsEnabled, logsDisabled, logsEnabled, roleDisabled, roleEnabled, pollEnabled, pollsDisabled, closeTicketEmbed } = require('../../files/embeds');
const { reopenButtonClosed, deleteTicketC, closeTicketWCancelDis, role, channel, nextPage3, nextPage4, channel2, welcomeButtons, ticketButtons, suggestButtons, toggle2, nextPage2, nextPage1, reportButtons, musicButtons, selectCategory, disabledToggle, levelsButtons, toggle, logButtons, roleButtons, disableLevel, pollButtons, pictureButtonsDisabled } = require('../../files/interactions');
const { embedClose1, noOwner } = require('../../files/embeds');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        try {
            if (interaction.isCommand()) {
                const command = client.commands.get(interaction.commandName);
                consola.info(`/${command.name} was used.`)
                if (!command) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(colors.RED)
                            .setTimestamp()
                            .setTitle("⛔ An error occured while trying to run this command!")
                    ]
                }) && client.commands.delete(interaction.commandName);

                command.execute(client, interaction);

            }

            if (interaction.isButton()) {
                if (interaction.customId === "answer1") {
                    const embedRaw = interaction.message.embeds;
                    const embed = embedRaw[Math.floor(Math.random() * embedRaw.length)];
                    const description = embed.description;

                    function getQuizAnswers(desc) {
                        return quiz.filter(
                            function (quiz) {
                                return quiz.question == desc
                            }
                        );
                    }
                    const answersRaw = getQuizAnswers(description);
                    const answers = answersRaw[Math.floor(Math.random() * answersRaw.length)];

                    if (answers.answer1 === answers.correct) {
                        const correctEmbed = new discord.MessageEmbed()
                            .setTitle(`You were correct!`)
                            .setDescription(`**Question:**\n${answers.question}`)
                            .addField(`Answer`, `${answers.correct}`)
                            .setColor(colors.LIME)
                            .setTimestamp()
                        interaction.update({ embeds: [correctEmbed], components: [] });
                    } else {
                        const wrongEmbed = new discord.MessageEmbed()
                            .setTitle(`You were wrong!`)
                            .setDescription(`**Question:**\n${answers.question}`)
                            .addField(`Correct Answer`, `${answers.correct}`)
                            .addField(`Your answer`, `${answers.answer1}`)
                            .setColor(colors.RED)
                            .setTimestamp()
                        interaction.update({ embeds: [wrongEmbed], components: [] });
                    }
                }
                if (interaction.customId === "answer2") {
                    const embedRaw = interaction.message.embeds;
                    const embed = embedRaw[Math.floor(Math.random() * embedRaw.length)];
                    const description = embed.description;

                    function getQuizAnswers(desc) {
                        return quiz.filter(
                            function (quiz) {
                                return quiz.question == desc
                            }
                        );
                    }
                    const answersRaw = getQuizAnswers(description);
                    const answers = answersRaw[Math.floor(Math.random() * answersRaw.length)];

                    if (answers.answer2 === answers.correct) {
                        const correctEmbed = new discord.MessageEmbed()
                            .setTitle(`You were correct!`)
                            .setDescription(`**Question:**\n${answers.question}`)
                            .addField(`Answer`, `${answers.correct}`)
                            .setColor(colors.LIME)
                            .setTimestamp()
                        interaction.update({ embeds: [correctEmbed], components: [] });
                    } else {
                        const wrongEmbed = new discord.MessageEmbed()
                            .setTitle(`You were wrong!`)
                            .setDescription(`**Question:**\n${answers.question}`)
                            .addField(`Correct Answer`, `${answers.correct}`)
                            .addField(`Your answer`, `${answers.answer2}`)
                            .setColor(colors.RED)
                            .setTimestamp()
                        interaction.update({ embeds: [wrongEmbed], components: [] });
                    }
                }
                if (interaction.customId === "answer3") {
                    const embedRaw = interaction.message.embeds;
                    const embed = embedRaw[Math.floor(Math.random() * embedRaw.length)];
                    const description = embed.description;

                    function getQuizAnswers(desc) {
                        return quiz.filter(
                            function (quiz) {
                                return quiz.question == desc
                            }
                        );
                    }
                    const answersRaw = getQuizAnswers(description);
                    const answers = answersRaw[Math.floor(Math.random() * answersRaw.length)];

                    if (answers.answer3 === answers.correct) {
                        const correctEmbed = new discord.MessageEmbed()
                            .setTitle(`You were correct!`)
                            .setDescription(`**Question:**\n${answers.question}`)
                            .addField(`Answer`, `${answers.correct}`)
                            .setColor(colors.LIME)
                            .setTimestamp()
                        interaction.update({ embeds: [correctEmbed], components: [] });
                    } else {
                        const wrongEmbed = new discord.MessageEmbed()
                            .setTitle(`You were wrong!`)
                            .setDescription(`**Question:**\n${answers.question}`)
                            .addField(`Correct Answer`, `${answers.correct}`)
                            .addField(`Your answer`, `${answers.answer3}`)
                            .setColor(colors.RED)
                            .setTimestamp()
                        interaction.update({ embeds: [wrongEmbed], components: [] });
                    }
                }
            }

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
                        levelEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });

            if (interaction.isButton()) {
                if (interaction.customId === "meme") {

                    const subreddits = ['meme', 'memes', 'dankmemes'];
                    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

                    if (subreddit === "meme") {
                        interaction.reply({ embeds: [MemeScanning] });
                        meme('meme', function (err, data) {
                            if (err) return interaction.editReply({ embeds: [errorMain] });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`${data.title}`)
                                .setColor(colors.COLOR)
                                .setURL(data.url)
                                .setImage(`${data.url}`)
                                .setFooter(`r/${data.subreddit} - u/${data.author}`)
                                .setTimestamp('Posted ' + data.created)
                            interaction.editReply({ embeds: [embed], components: [newMeme] });
                        });
                    } else if (subreddit === "memes") {
                        interaction.reply({ embeds: [MemeScanning] });
                        meme('memes', function (err, data) {
                            if (err) return interaction.editReply({ embeds: [errorMain] });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`${data.title}`)
                                .setColor(colors.COLOR)
                                .setURL(data.url)
                                .setImage(`${data.url}`)
                                .setFooter(`r/${data.subreddit} - u/${data.author}`)
                                .setTimestamp('Posted ' + data.created)
                            interaction.editReply({ embeds: [embed], components: [newMeme] });
                        });
                    } else if (subreddit === "dankmemes") {
                        interaction.reply({ embeds: [MemeScanning] });

                        meme('dankmemes', function (err, data) {
                            if (err) return interaction.editReply({ embeds: [errorMain] });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`${data.title}`)
                                .setColor(colors.COLOR)
                                .setURL(data.url)
                                .setImage(`${data.url}`)
                                .setFooter(`r/${data.subreddit} - u/${data.author}`)
                                .setTimestamp('Posted ' + data.created)
                            interaction.editReply({ embeds: [embed], components: [newMeme] });
                        });
                    }
                }
                if (interaction.customId === "cat") {
                    interaction.reply({ embeds: [CatScanning] });
                    meme('cats', function (err, data) {

                        if (err) return interaction.followUp({ embeds: [errorMain] });

                        const embed = new MessageEmbed()
                            .setTitle(`Here is your cat image! :cat:`)
                            .setColor(colors.COLOR)
                            .setImage(`${data.url}`)
                            .setURL(data.url)
                            .setFooter(`r/${data.subreddit}`)
                            .setTimestamp('Posted ' + data.created)

                        interaction.editReply({ embeds: [embed], components: [newCat] });
                    });

                }
                if (interaction.customId === "dog") {
                    interaction.reply({ embeds: [DogScanning] });

                    meme('dogpics', function (err, data) {

                        if (err) return interaction.followUp({ embeds: [errorMain] });
                        const embed = new MessageEmbed()
                            .setTitle(`Here is your dog image! :dog:`)
                            .setColor(colors.COLOR)
                            .setImage(`${data.url}`)
                            .setURL(data.url)
                            .setFooter(`r/${data.subreddit}`)
                            .setTimestamp('Posted ' + data.created)
                        interaction.editReply({ embeds: [embed], components: [newDog] });
                    });
                }
                if (interaction.customId === "memePic") {

                    const pictureEmbed2 = new discord.MessageEmbed()
                        .setTitle("Pick a picture!")
                        .setDescription(`Use the buttons below this message to pick a picture you wish to get!`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.update({ embeds: [pictureEmbed2], components: [pictureButtonsDisabled] });

                    const subreddits = ['meme', 'memes', 'dankmemes'];
                    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

                    if (subreddit === "meme") {
                        interaction.reply({ embeds: [MemeScanning] });
                        meme('meme', function (err, data) {
                            if (err) return interaction.channel.send({ embeds: [errorMain] });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`${data.title}`)
                                .setColor(colors.COLOR)
                                .setURL(data.url)
                                .setImage(`${data.url}`)
                                .setFooter(`r/${data.subreddit} - u/${data.author}`)
                                .setTimestamp('Posted ' + data.created)
                            interaction.editReply({ embeds: [embed], components: [newMeme] });
                        });
                    } else if (subreddit === "memes") {
                        interaction.reply({ embeds: [MemeScanning] });
                        meme('memes', function (err, data) {
                            if (err) return interaction.channel.send({ embeds: [errorMain] });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`${data.title}`)
                                .setColor(colors.COLOR)
                                .setURL(data.url)
                                .setImage(`${data.url}`)
                                .setFooter(`r/${data.subreddit} - u/${data.author}`)
                                .setTimestamp('Posted ' + data.created)
                            interaction.editReply({ embeds: [embed], components: [newMeme] });
                        });
                    } else if (subreddit === "dankmemes") {
                        interaction.reply({ embeds: [MemeScanning] });

                        meme('dankmemes', function (err, data) {
                            if (err) return interaction.channel.send({ embeds: [errorMain] });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`${data.title}`)
                                .setColor(colors.COLOR)
                                .setURL(data.url)
                                .setImage(`${data.url}`)
                                .setFooter(`r/${data.subreddit} - u/${data.author}`)
                                .setTimestamp('Posted ' + data.created)
                            interaction.editReply({ embeds: [embed], components: [newMeme] });
                        });
                    }
                    const pictureEmbed = new discord.MessageEmbed()
                        .setTitle("Pick a picture!")
                        .setDescription(`Use the buttons below this message to pick a picture you wish to get!`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.update({ embeds: [pictureEmbed], components: [pictureButtonsDisabled] });

                }
                if (interaction.customId === "catPics") {
                    const pictureEmbed3 = new discord.MessageEmbed()
                        .setTitle("Pick a picture!")
                        .setDescription(`Use the buttons below this message to pick a picture you wish to get!`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.update({ embeds: [pictureEmbed3], components: [pictureButtonsDisabled] });

                    interaction.reply({ embeds: [CatScanning] });
                    meme('cats', function (err, data) {

                        if (err) return interaction.t({ embeds: [errorMain] });

                        const embed = new MessageEmbed()
                            .setTitle(`Here is your cat image! :cat:`)
                            .setColor(colors.COLOR)
                            .setImage(`${data.url}`)
                            .setURL(data.url)
                            .setFooter(`r/${data.subreddit}`)
                            .setTimestamp('Posted ' + data.created)

                        interaction.editReply({ embeds: [embed], components: [newCat] });
                    });
                    const pictureEmbed = new discord.MessageEmbed()
                        .setTitle("Pick a picture!")
                        .setDescription(`Use the buttons below this message to pick a picture you wish to get!`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.update({ embeds: [pictureEmbed], components: [pictureButtonsDisabled] });


                }
                if (interaction.customId === "dogPic") {
                    interaction.reply({ embeds: [DogScanning] });

                    meme('dogpics', function (err, data) {

                        if (err) return interaction.channel.send({ embeds: [errorMain] });
                        const embed = new MessageEmbed()
                            .setTitle(`Here is your dog image! :dog:`)
                            .setColor(colors.COLOR)
                            .setImage(`${data.url}`)
                            .setURL(data.url)
                            .setFooter(`r/${data.subreddit}`)
                            .setTimestamp('Posted ' + data.created)
                        interaction.editReply({ embeds: [embed], components: [newDog] });
                    });
                    const pictureEmbed = new discord.MessageEmbed()
                        .setTitle("Pick a picture!")
                        .setDescription(`Use the buttons below this message to pick a picture you wish to get!`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.update({ embeds: [pictureEmbed], components: [pictureButtonsDisabled] });

                }
                if (interaction.customId === "close") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

                    if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
                        return interaction.channel.send({ embeds: [noOwner] })
                    }

                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
                    const closeEmbed = new MessageEmbed()
                        .setColor(colors.TICKET_CLOSING)
                        .setTitle("Closing ticket...")
                        .setDescription("Reopen this ticket using the buttons below this message!")
                        .setTimestamp()
                    interaction.channel.send({ embeds: [closeEmbed], components: [reopenButton] });

                    let ticketsCatName = guildDatabase.ticketCategory;
                    if (ticketsCatName === "undefined") {
                        let ticketsCatName = "Tickets";
                    }

                    let ticketCategory = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);

                    if (ticketCategory.id !== interaction.channel.parentId) return interaction.reply({ embeds: [notATicket] });


                    let CticketsCatName = guildDatabase.closedTicketCategory;
                    if (CticketsCatName === "undefined") {
                        let CticketsCatName = "Closed Tickets";
                    }

                    let closedCategory = interaction.guild.channels.cache.find(cat => cat.name === CticketsCatName);

                    if (closedCategory === undefined) {
                        interaction.channel.send("the closed category does not exist, creating one now...");
                        interaction.guild.channels.create(CticketsCatName, { type: "GUILD_CATEGORY" });
                        return interaction.channel.send(":white_check_mark: Succes! Please run the command again to create your ticket.")
                    }

                    interaction.channel.setParent(closedCategory);
                    interaction.channel.permissionOverwrites.edit(interaction.user, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true
                    });
                    interaction.update({ embeds: [closeTicketEmbed], components: [closeTicketWCancelDis] })

                }
                if (interaction.customId === "cancel") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

                    interaction.update({ embeds: [embedClose1], components: [deleteTicketC] });
                    if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
                        return interaction.channel.send({ embeds: [noOwner] })
                    }
                    const cancelEmbed = new MessageEmbed()
                        .setColor(colors.TICKET_CLOSING)
                        .setTitle(":x: Cancelled!")
                        .setDescription("Cancelled the deleting of this ticket.")
                        .setTimestamp()
                    interaction.channel.send({ embeds: [cancelEmbed] });
                }
                if (interaction.customId === "cancelclose") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

                    interaction.update({ embeds: [closeTicketEmbed], components: [closeTicketWCancelDis] })

                    if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
                        return interaction.channel.send({ embeds: [noOwner] })
                    }
                    const cancelEmbed = new MessageEmbed()
                        .setColor(colors.TICKET_CLOSING)
                        .setTitle(":x: Cancelled!")
                        .setDescription("Cancelled the deleting/closing of this ticket.")
                        .setTimestamp()
                    interaction.channel.send({ embeds: [cancelEmbed] });
                }
                if (interaction.customId === "deleteconfirm") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

                    let ticketsCatName = guildDatabase.ticketCategory;
                    if (ticketsCatName === "undefined") {
                        let ticketsCatName = "Tickets";
                    }

                    let ticketCategory = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);

                    if (ticketCategory.id !== interaction.channel.parentId) return interaction.reply({ embeds: [notATicket] });

                    interaction.update({ components: [deleteTicket] });
                    const deleting = new MessageEmbed()
                        .setColor(colors.TICKET_DELETE)
                        .setTitle("Ticket deleting...")
                        .setDescription("Ticket will be deleted, this cannot be reverted.")
                        .setTimestamp()
                    interaction.channel.send({ embeds: [deleting] });
                    setTimeout(() => {
                        interaction.channel.delete()
                    }, 2000);
                }
                if (interaction.customId === "delete") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

                    interaction.update({ components: [deleteTicket] });
                    if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
                        return interaction.channel.send({ embeds: [noOwner] })
                    }

                    let ticketsCatName = guildDatabase.ticketCategory;
                    if (ticketsCatName === "undefined") {
                        let ticketsCatName = "Tickets";
                    }

                    let ticketCategory = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);

                    if (ticketCategory.id !== interaction.channel.parentId) return interaction.reply({ embeds: [notATicket] });

                    const sureDelete = new MessageEmbed()
                        .setColor(colors.TICKET_CLOSING)
                        .setTitle("Are you sure you want to delete this ticket?")
                        .setDescription("This cannot be reverted.")
                        .setTimestamp()
                    interaction.channel.send({ embeds: [sureDelete], components: [deleteTicket] });
                }
                if (interaction.customId === "ticketmsg") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

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
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

                    let ticketsCatName = guildDatabase.ticketCategory;
                    let CticketsCatName = guildDatabase.closedTicketCategory;

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
                    interaction.update({ components: [reopenButtonClosed] });
                    if (guildDatabase.ticketEnabled === "false") return interaction.channel.send({ embeds: [ticketsDisabled] });

                    if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
                        return interaction.channel.send({ embeds: [noOwner] })
                    }
                    if (guildDatabase.ticketEnabled === "false") return interaction.channel.send({ embeds: [ticketsDisabled] });
                    const reopenEmbed = new MessageEmbed()
                        .setColor(colors.TICKET_CLOSING)
                        .setTitle("Re-opening ticket...")
                        .setDescription("Close or delete this ticket using the buttons below this message!")
                        .setTimestamp()
                    interaction.channel.send({ embeds: [reopenEmbed], components: [closeTicket] });

                    let ticketsCatName = guildDatabase.ticketCategory;
                    if (ticketsCatName === "undefined") {
                        let ticketsCatName = "Tickets";
                    }

                    let Category = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);

                    if (Category === undefined) {
                        interaction.channel.send("The tickets category does not exist, creating one now...");
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
                    .addField("Current value", `${guildDatabase.mutedRole}`)
                    .setColor(colors.COLOR)
                    .setThumbnail("https://i.imgur.com/jgdQUul.png");
                const mainRole = new discord.MessageEmbed()
                    .setTitle("Change Main Role name")
                    .setDescription("Enter the new name within 15 seconds to change it.")
                    .addField("Current value", `${guildDatabase.mainRole}`)
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
                            await guildDatabase.updateOne({
                                mutedRole: m.content
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
                            await guildDatabase.updateOne({
                                mainRole: m.content
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
                .addField("Current value", `${guildDatabase.levelEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleLogs = new discord.MessageEmbed()
                .setTitle("Toggle Logs")
                .setDescription("Use the buttons to enable/disable guild events logging.")
                .addField("Current value", `${guildDatabase.logEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleRole = new discord.MessageEmbed()
                .setTitle("Toggle Join Roles")
                .setDescription("Use the buttons to enable/disable join roles.")
                .addField("Current value", `${guildDatabase.roleEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png"); 3
            const toggleMusic = new discord.MessageEmbed()
                .setTitle("Toggle Music")
                .setDescription("Use the buttons to enable/disable all music commands.")
                .addField("Current value", `${guildDatabase.musicEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleReport = new discord.MessageEmbed()
                .setTitle("Toggle Reports")
                .setDescription("Use the buttons to enable/disable reporting for this guild.")
                .addField("Current value", `${guildDatabase.reportEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleSuggest = new discord.MessageEmbed()
                .setTitle("Toggle Suggestions")
                .setDescription("Use the buttons to enable/disable suggestions for this guild.")
                .addField("Current value", `${guildDatabase.suggestEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleTicket = new discord.MessageEmbed()
                .setTitle("Toggle Tickets")
                .setDescription("Use the buttons to enable/disable tickets for this guild.")
                .addField("Current value", `${guildDatabase.ticketEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const toggleWelcome = new discord.MessageEmbed()
                .setTitle("Toggle Welcome Messages")
                .setDescription("Use the buttons to enable/disable welcome messages for this guild.")
                .addField("Current value", `${guildDatabase.welcomeEnabled}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const togglePoll = new discord.MessageEmbed()
                .setTitle("Toggle Polls")
                .setDescription("Use the buttons to enable/disable polls for this guild.")
                .addField("Current value", `${guildDatabase.pollsEnabled}`)
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
                if (interaction.values[0] === "role_toggle") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ ephemeral: true, embeds: [toggleRole], components: [roleButtons] })
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
                if (interaction.values[0] === "poll_toggle") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ ephemeral: true, embeds: [togglePoll], components: [pollButtons] });
                }
            };

            if (interaction.isButton()) {
                if (interaction.customId === "enableLevel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        levelEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [levelsEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableLevel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        levelEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [levelsDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enableLogs") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        logEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [logsEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableLogs") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        logEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [logsDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enableRole") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ ephemeral: true, embeds: [roleEnabled], components: [disabledToggle] });
                    await guildDatabase.updateOne({
                        roleEnabled: true
                    });
                }
                if (interaction.customId === "disableRole") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ ephemeral: true, embeds: [roleDisabled], components: [disabledToggle] });
                    await guildDatabase.updateOne({
                        roleEnabled: false
                    });
                }
                if (interaction.customId === "enableMusic") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        musicEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [musicEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableMusic") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        musicEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [musicDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enableReport") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        reportEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [reportEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableReport") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        reportEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [reportDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enableSuggest") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        suggestEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [suggestEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableSuggest") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        suggestEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [suggestDisabled1], components: [disabledToggle] });
                }
                if (interaction.customId === "enableTicket") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        ticketEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [ticketEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableTicket") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        ticketEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [ticketDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enablePoll") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        pollsEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [pollEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disablePoll") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        pollsEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [pollsDisabled], components: [disabledToggle] });
                }
                if (interaction.customId === "enableWelcome") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        welcomeEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [welcomeEnabled], components: [disabledToggle] });
                }
                if (interaction.customId === "disableWelcome") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
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
                .addField("Current value", `<#${guildDatabase.logChannelID}>`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const reportChannel = new discord.MessageEmbed()
                .setTitle("Change Report Channel")
                .setDescription("Mention the new channel within 15 seconds to change it.")
                .addField("Current value", `<#${guildDatabase.reportChannelID}>`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const suugestChannel = new discord.MessageEmbed()
                .setTitle("Change Suggestions Channel")
                .setDescription("Mention the new channel within 15 seconds to change it.")
                .addField("Current value", `<#${guildDatabase.suggestChannelID}>`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const welcomeChannel = new discord.MessageEmbed()
                .setTitle("Change Welcome Messages Channel")
                .setDescription("Mention the new channel within 15 seconds to change it.")
                .addField("Current value", `<#${guildDatabase.welcomeChannelID}>`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const ticketChannel = new discord.MessageEmbed()
                .setTitle("Change Main Ticket Category name")
                .setDescription("Send the new channel name within 15 seconds to change it.")
                .addField("Current value", `${guildDatabase.ticketCategory}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const CticketChannel = new discord.MessageEmbed()
                .setTitle("Change Closed Ticket Category Name")
                .setDescription("Send the new category name within 15 seconds to change it.")
                .addField("Current value", `${guildDatabase.closedTicketCategory}`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const pollChannel = new discord.MessageEmbed()
                .setTitle("Change Poll Messages channel")
                .setDescription("Mention the new channel within 15 seconds to change it.")
                .addField("Current value", `<#${guildDatabase.pollChannelID}>`)
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png");
            const levelUpEmbed = new discord.MessageEmbed()
                .setTitle("Change Level Up Message Channel Name")
                .setDescription("Mention the new channel within 15 seconds to change it, or click the button to disable this channel, level up messages would then be sent in the channel the user is in at that time.")
                .addField("Current value", `${guildDatabase.levelChannelID}`)
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
                            await guildDatabase.updateOne({
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
                            await guildDatabase.updateOne({
                                levelChannelID: D
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
                            await guildDatabase.updateOne({
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
                            await guildDatabase.updateOne({
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
                            await guildDatabase.updateOne({
                                welcomeChannelID: F
                            });
                            const updated4 = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed welcome channel to ${F}!`)
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
                            await guildDatabase.updateOne({
                                ticketCategory: m.content
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
                            await guildDatabase.updateOne({
                                closedTicketCategory: m.content
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
                if (interaction.values[0] === "poll_channel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [pollChannel], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            const C = m.mentions.channels.first();
                            if (!C) return;
                            await guildDatabase.updateOne({
                                pollChannelID: C
                            });
                            const updated = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed poll channel to ${C}!`)
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
                    await guildDatabase.updateOne({
                        levelChannelID: "none"
                    });

                }
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
}