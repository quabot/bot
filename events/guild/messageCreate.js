const Discord = require('discord.js');
const mongoose = require('mongoose');
const prefix = "!";
const Levels = require('discord.js-leveling');
const DisTube = require('distube');
const consola = require('consola');

const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const swearwords = require("../../files/data.json");
const colors = require('../../files/colors.json');

const errorMain = new Discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new Discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)

module.exports = {
    name: "messageCreate",
    async execute(message, args, client) {

        //consola.info(`${message.guild.name} - ${message.channel.name} | ${message.author.username}: ${message.content}`)
        if (!message.guild) return;
        if (message.author.bot) return;
        const thisGuildId = message.guild.id;

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    //_id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.PREFIX,
                    logChannelID: "none",
                    enableLog: true,
                    enableSwearFilter: false,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: "none",
                    suggestEnabled: true,
                    suggestChannelID: "none",
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                    closedTicketCategoryName: "Closed Tickets",
                    welcomeEnabled: true,
                    welcomeChannelID: "none",
                    enableNSFWContent: false,
                    levelUpChannelID: "none",
                });

                newGuild.save()
                    .catch(err => message.channel.send({ embeds: [errorMain] }));

                return message.channel.send({ embeds: [addedDatabase] });
            }
        });

        const IDGuild = message.guild.id;
        const user = message.author;
        const prefix = "!";

        if (settings.enableLevel === "true") {

            if (message.author.id === "486563467810308096") {
                const requiredXp = Levels.xpFor(parseInt(user.level) + 1)
                const randomAmountOfXp = Math.floor(Math.random() * 20) + 1;
                const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

                const joinChannel = message.guild.channels.cache.get(settings.levelUpChannelID);
                if (hasLeveledUp) {
                    const XPUSer = await Levels.fetch(message.author.id, message.guild.id);

                    const levelUpEmbed = new Discord.MessageEmbed()
                        .setColor(colors.COLOR)
                        .setDescription(`${message.author} just leveled up to level **${XPUSer.level}**, and has **${XPUSer.xp}** XP! You get XP by chatting and being active.`)
                        .setAuthor(`${message.author.tag} is now level ${XPUSer.level}!`, message.author.avatarURL())
                        .setThumbnail(message.author.avatarURL())
                        .setTimestamp()
                        .setFooter("Fun fact: This is the bot's developer!")
                    if (joinChannel) return joinChannel.send({ embeds: [levelUpEmbed] });
                    const sendEmbed = await message.channel.send({ embeds: [levelUpEmbed] });
                }
                return; 
            }

            if (message.content.startsWith("pls" || "?" || "!")) return;

            const requiredXp = Levels.xpFor(parseInt(user.level) + 1)
            const randomAmountOfXp = Math.floor(Math.random() * 14) + 1;
            const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

            const joinChannel = message.guild.channels.cache.get(settings.levelUpChannelID);
            if (hasLeveledUp) {
                const XPUSer = await Levels.fetch(message.author.id, message.guild.id);

                const levelUpEmbed = new Discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setDescription(`${message.author} just leveled up to level **${XPUSer.level}**, and has **${XPUSer.xp}** XP! You get XP by chatting and being active.`)
                    .setAuthor(`${message.author.tag} is now level ${XPUSer.level}!`, message.author.avatarURL())
                    .setThumbnail(message.author.avatarURL())
                    .setTimestamp()
                    .setFooter("Continue to chat to level up further!")
                if (joinChannel) return joinChannel.send({ content: `${message.author}`, embeds: [levelUpEmbed] });
                const sendEmbed = await message.channel.send(`${message.author}`, { embeds: [levelUpEmbed] }).then(m => {
                    setTimeout(() => {
                        m.edit({ content: `** **`, embeds: [levelUpEmbed] })
                    }, 500);
                })
            }
        }
    }
}