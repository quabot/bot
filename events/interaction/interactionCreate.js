const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const consola = require('consola');
const discord = require('discord.js');
const { meme } = require('memejs');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const { commands } = require('../../index');

const { CatScanning, errorMain, addedDatabase, DogScanning, ticketsDisabled, MemeScanning } = require('../../files/embeds');
const { closeTicket, reopenButton, ticketButton, deleteTicket, newMeme, newCat, newDog } = require('../../files/interactions');

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

        if (interaction.isButton()) {
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
    }
}