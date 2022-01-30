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
const { reopenButtonClosed, deleteTicketC, closeTicketWCancelDis, role, channel, nextPage3, nextPage4, channel2, welcomeButtons, ticketButtons, suggestButtons, toggle2, nextPage2, nextPage1, reportButtons, musicButtons, selectCategory, disabledToggle, levelsButtons, toggle, logButtons, roleButtons, disableLevel, pollButtons, pictureButtonsDisabled, otherCategory } = require('../../files/interactions');
const { embedClose1, noOwner } = require('../../files/embeds');

const cooldowns = new Map()

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

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
                    mutedRole: "Muted",
                    joinMessage: "Welcome {user} to **{guild-name}**!",
                    swearEnabled: false,
                    transcriptChannelID: "none"
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [errorMain] });
                    });
                return interaction.channel.send({ embeds: [addedDatabase] });
            }
        });

        try {
            if (interaction.isCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (!cooldowns.has(command.name)) {
                    cooldowns.set(command.name, new discord.Collection());
                }

                const current_time = Date.now();
                const time_stamps = cooldowns.get(command.name);
                const cooldown_amount = 1 * 1000;

                if (time_stamps.has(interaction.user.id)) {
                    const expiration_time = time_stamps.get(interaction.user.id) + cooldown_amount;

                    if (current_time < expiration_time) {
                        const time_left = (expiration_time - current_time) / 1000;
                        return interaction.reply({ ephemeral: true, content: `Please wait ${time_left.toFixed(1)} more seconds before using /${command.name}` });
                    }
                }

                time_stamps.set(interaction.user.id, current_time);
                setTimeout(() => time_stamps.delete(interaction.user.id), cooldown_amount);

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

                const UserEco = require('../../schemas/UserEcoSchema');
                const UserEcoDatabase = await UserEco.findOne({
                    userId: interaction.user.id
                }, (err, usereco) => {
                    if (err) console.error(err);
                    if (!usereco) {
                        const newEco = new UserEco({
                            userId: interaction.user.id,
                            outWallet: 250,
                            walletSize: 500,
                            commandsUsed: 0,
                            inWallet: 250,
                            lastUsed: "none"
                        });
                        newEco.save()
                            .catch(err => {
                                console.log(err);
                                
                            });
                        return;
                    }
                });

                let commandsused = UserEcoDatabase.commandsUsed;
                if (commandsused === undefined) commandsused = 0;

                await UserEcoDatabase.updateOne({
                    commandsUsed: commandsused + 1,
                });
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

            if (interaction.isButton()) {
                if (interaction.customId === "closebutton") {
                    interaction.reply({ embeds: [closeTicketEmbed], components: [closeTicketWCancel] })
                }
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
                            interaction.editReply({ embeds: [embed], components: [newMeme] }).catch(err => {
                                interaction.channel.send({ embeds: [embed], components: [newMeme] })
                                return;
                            });
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
                            interaction.editReply({ embeds: [embed], components: [newMeme] }).catch(err => {
                                interaction.channel.send({ embeds: [embed], components: [newMeme] })
                                return;
                            });
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
                            interaction.editReply({ embeds: [embed], components: [newMeme] }).catch(err => {
                                interaction.channel.send({ embeds: [embed], components: [newMeme] })
                                return;
                            });
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

                        interaction.editReply({ embeds: [embed], components: [newCat] }).catch(err => {
                            interaction.channel.send({ embeds: [embed], components: [newCat] })
                            return;
                        });
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
                        interaction.editReply({ embeds: [embed], components: [newDog] }).catch(err => {
                            interaction.channel.send({ embeds: [embed], components: [newDog] })
                            return;
                        });
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
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
}