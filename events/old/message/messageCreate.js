const Discord = require('discord.js');
const mongoose = require('mongoose');
const prefix = "!";
const Levels = require('discord.js-leveling');
const DisTube = require('distube');
const consola = require('consola');
const config = require('../../files/settings.json');

const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');


module.exports = {
    name: "messageCreate",
    async execute(message, args, client) {

        try {

            if (message.guild === null) {
                if (message.author.bot) return;
                const embed = new MessageEmbed()
                    .setTitle("Hello!")
                    .setDescription("I'm QuaBot, a multipurpose bot with Music, Reaction Roles, moderation and a lot more! You can check my commands [here](https://quabot.net) and invite me [here](https://invite.quabot.net)!")
                    .setColor(COLOR_MAIN)
                    
                    .setThumbnail("https://i.imgur.com/0vCe2oB.png")
                message.channel.send({ embeds: [embed] });
                return;
            }

            const User = require('../../schemas/UserSchema');
            const userMention = message.mentions.users.first();
            if (userMention) {
                const userDatabase2 = await User.findOne({
                    userId: userMention.id,
                    guildId: message.guild.id,
                }, (err, user) => {
                    if (err) console.error(err);
                    if (!user) {
                        const newUser = new User({
                            userId: userMention.id,
                            guildId: message.guild.id,
                            guildName: message.guild.name,
                            typeScore: 0,
                            kickCount: 0,
                            banCount: 0,
                            warnCount: 0,
                            muteCount: 0,
                            afk: false,
                            afkStatus: "none",
                        });
                        newUser.save()
                            .catch(err => {
                                console.log(err);
                            });
                    }
                }).clone().catch(function (err) { console.log(err) });
                if (userDatabase2) {
                    if (userDatabase2.afk === true) {
                        if (userMention === message.author) {
                            const embed = new MessageEmbed()
                                .setDescription(`Removing your afk status!`)
                                .setColor(COLOR_MAIN)
                            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(err => {
                                return;
                            })
                            await userDatabase2.updateOne({
                                afk: false
                            });
                            return;
                        }
                        const embed = new MessageEmbed()
                            .setDescription(`${userMention} is afk!`)
                            .setColor(COLOR_MAIN)
                        if (userDatabase2.afkStatus !== "none") {
                            embed.setDescription(`${userMention} is afk: **${userDatabase2.afkStatus}**`)
                        }
                        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(err => {
                            return;
                        })
                        return;
                    }
                }
            }

            const userDatabase = await User.findOne({
                userId: message.author.id,
                guildId: message.guild.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new User({
                        userId: message.author.id,
                        guildId: message.guild.id,
                        guildName: message.guild.name,
                        typeScore: 0,
                        kickCount: 0,
                        banCount: 0,
                        warnCount: 0,
                        muteCount: 0,
                        afk: false,
                        afkStatus: "none",
                        bio: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (userDatabase.afk === true) {
                const embed = new MessageEmbed()
                    .setDescription(`Removing your afk status!`)
                    .setColor(COLOR_MAIN)
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(err => {
                    return;
                })
                await userDatabase.updateOne({
                    afk: false
                });
                return;
            }
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: message.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: message.guild.id,
                        guildName: message.guild.name,
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
                        musicEnabled: true,
                        levelEnabled: false,
                        pollEnabled: true,
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
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                    return;
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;
            if (!message.guild) return;
            if (message.author.bot) return;
            const thisGuildId = message.guild.id;

            const IDGuild = message.guild.id;
            const user = message.author;
            const prefix = "!";

            if (guildDatabase.swearEnabled === "true") {
                const { Swears } = require('../../files/swearwords');
                let msg = message.content.toLowerCase();
                msg = msg.replace(/\s+/g, '');
                msg = msg.replace('.', '');
                msg = msg.replace(',', '');
                for (let i = 0; i < Swears.length; i++) {
                    if (msg.includes(Swears[i])) {
                        const SwearFound = new MessageEmbed()
                            .setDescription(`Please do not swear! One of your servers, **${message.guild.name}** has a swearfilter activated.`)
                            .setColor(COLOR_MAIN)
                        message.author.send({ embeds: [SwearFound] }).catch(err => {
                            console.log("DMS Disabled.");
                        })
                        message.delete().catch(err => {
                            console.log("Delete swearfilter error.");
                        });
                        const logChannel = message.guild.channels.cache.get(guildDatabase.logChannelID);

                        if (guildDatabase.logEnabled === "false") return;
                        if (logChannel) {
                            const embed = new MessageEmbed()
                                .setTitle("SWEAR DETECTED")
                                .setDescription(`<:addfriend:941403540306423868> Member: ${message.author}\n\n<:thread:941403540327391282> Swearword: ${Swears[i]}`)
                                .setColor(COLOR_MAIN)
                                
                            logChannel.send({ embeds: [embed] }).catch(err => {
                                console.log("Delete swearfilter error.");
                            });
                        }
                        return;
                    }
                }
            }

            if (guildDatabase.levelEnabled === "true") {

                if (message.content.startsWith("pls" || "?" || "!")) return;


                const requiredXp = Levels.xpFor(3)
                let randomAmountOfXp = Math.floor(Math.random() * 14) + 1;
                if (message.content.length < 2) randomAmountOfXp = Math.ceil(randomAmountOfXp / 4);
                if (message.content.length < 5) randomAmountOfXp = Math.ceil(randomAmountOfXp / 3);
                if (message.content.length < 10) randomAmountOfXp = Math.ceil(randomAmountOfXp / 2);

                const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

                const joinChannel = message.guild.channels.cache.get(guildDatabase.levelChannelID);
                if (hasLeveledUp) {
                    const XPUSer = await Levels.fetch(message.author.id, message.guild.id);

                    const levelUpEmbed = new MessageEmbed()
                        .setColor(COLOR_MAIN)
                        .setDescription(`${message.author} just leveled up to level **${XPUSer.level}**, and has **${XPUSer.xp}** XP!`)
                        .setAuthor(`${message.author.tag} is now level ${XPUSer.level}!`, message.author.avatarURL())
                        .setThumbnail(message.author.avatarURL())
                    if (joinChannel) {
                        return joinChannel.send({ content: `${message.author}`, embeds: [levelUpEmbed] }).catch(err => {
                            return;
                        })
                    } else {
                        message.channel.send({ content: `${message.author}`, embeds: [levelUpEmbed] }).catch(err => {
                            return;
                        });
                    };
                }
            }
        } catch (e) {
            return;
        }
    }
}