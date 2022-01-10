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

            // let content = message.content;
            // if (content.startsWith("!" || "?" || "$" || ".")) {
            //     let commandName = content.substring(1)
            
            //     if (Commands.includes(commandName)) return message.reply(":robot: Please use a `/` to use my commands!");
            // }
            

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
            const prefix = "/";

            if (guildDatabase.levelEnabled === "true") {

                if (message.content.startsWith("pls" || "?" || "!")) return;


                const requiredXp = Levels.xpFor(parseInt(user.level) + 1)
                const randomAmountOfXp = Math.floor(Math.random() * 14) + 1;
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
                    if (joinChannel) { return joinChannel.send({ content: `${message.author}`, embeds: [levelUpEmbed] }) } else {
                        message.channel.send({ content: `${message.author}`, embeds: [levelUpEmbed] });
                    };
                }
            }
        } catch (e) {
            return;
        }
    }
}