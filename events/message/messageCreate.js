const Discord = require('discord.js');
const mongoose = require('mongoose');
const prefix = "!";
const Levels = require('discord.js-leveling');
const DisTube = require('distube');
const consola = require('consola');
const { Commands } = require("../../validation/commandnames");

const config = require('../../files/settings.json');
const colors = require('../../files/colors.json');

const { errorMain, addedDatabase } = require('../../files/embeds');
const { addbot } = require('../../files/interactions.js');

module.exports = {
    name: "messageCreate",
    async execute(message, args, client) {

        if (message.guild === null) {
            if (message.author.bot) return;
            const embed = new Discord.MessageEmbed()
                .setTitle("Ready to use QuaBot?")
                .setDescription("In order to start using quabot, you need to add it to your server first. Do that by clicking the button below this message.")
                .setColor(colors.COLOR)
                .setTimestamp()
                .setThumbnail("https://i.imgur.com/jgdQUul.png")
            message.channel.send({ embeds: [embed], components: [addbot] });
            return;
        }

        try {

            const User = require('../../schemas/UserSchema');
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
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            message.channel.send({ embeds: [errorMain] });
                        });
                    return;
                }
            });

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
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Closed Tickets",
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
                        swearEnabled: false,
                        transcriptChannelID: "none"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            message.channel.send({ embeds: [errorMain] });
                        });
                    return message.channel.send({ embeds: [addedDatabase] });
                }
            });

            if (!message.guild) return;
            if (message.author.bot) return;
            const thisGuildId = message.guild.id;

            const IDGuild = message.guild.id;
            const user = message.author;
            const prefix = "!";

            if (guildDatabase.swearEnabled === "true") {
                const { Swears } = require('../../validation/swearwords');
                let msg = message.content.toLowerCase();
                msg = msg.replace(/\s+/g, '');
                msg = msg.replace('.', '');
                msg = msg.replace(',', '');
                for (let i = 0; i < Swears.length; i++) {
                    if (msg.includes(Swears[i])) {
                        const SwearFound = new Discord.MessageEmbed()
                            .setDescription(`Please do not swear! One of your servers, **${message.guild.name}** has a swearfilter activated.`)
                            .setColor(colors.COLOR)
                        message.author.send({ embeds: [SwearFound] }).catch(err => {
                            console.log("DMS Disabled.");
                        })
                        message.delete().catch(err => {
                            console.log("Delete swearfilter error.");
                        });
                        const logChannel = message.guild.channels.cache.get(guildDatabase.logChannelID);

                        if (guildDatabase.logEnabled === "false") return;
                        if (logChannel) {
                            const embed = new Discord.MessageEmbed()
                                .setTitle("Swear Filter Triggered")
                                .addField("User", `${message.author}`)
                                .addField("Swearword", `${Swears[i]}`)
                                .setFooter(`ID: ${message.author.id}`)
                                .setColor(colors.COLOR)
                                .setTimestamp()
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

                    const levelUpEmbed = new Discord.MessageEmbed()
                        .setColor(colors.COLOR)
                        .setDescription(`${message.author} just leveled up to level **${XPUSer.level}**, and has **${XPUSer.xp}** XP! You get XP by chatting and being active.`)
                        .setAuthor(`${message.author.tag} is now level ${XPUSer.level}!`, message.author.avatarURL())
                        .setThumbnail(message.author.avatarURL())
                        .setTimestamp()
                        .setFooter("Continue to chat to level up further!")
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
            console.log(e)
            return;
        }
    }
}