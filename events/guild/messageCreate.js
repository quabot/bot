const Discord = require('discord.js');
const mongoose = require('mongoose');
const Levels = require('discord.js-leveling');
const DisTube = require('distube');
const consola = require('consola');

const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const swearwords = require("../../files/data.json");
const colors = require('../../files/colors.json');

const { Guilds } = require("../validation/bannedguilds.js");

const errorMain = new Discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new Discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)

module.exports = {
    name: "messageCreate",
    async execute(message, args, client) {

        if(Perms.includes(message.guild.id)) return;

        const thisGuildId = message.guild.id;

        if (!message.guild) return;
        if (message.author.bot) return;

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.PREFIX,
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
                    .catch(err => message.channel.send({ embeds: [errorMain] }));

                return message.channel.send({ embeds: [addedDatabase] });
            }
        });

        const IDGuild = message.guild.id;
        const user = message.author;
        const prefix = settings.prefix;
        const swearFilterOn = settings.enableSwearFilter;

        if (settings.enableLevel === "true") {

            const requiredXp = Levels.xpFor(parseInt(user.level) + 1)
            const randomAmountOfXp = Math.floor(Math.random() * 29) + 1;
            const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

            if (hasLeveledUp) {
                const user = await Levels.fetch(message.author.id, message.guild.id);

                const levelEmbed = new Discord.MessageEmbed()
                    .setTitle('New Level!')
                    .setColor(colors.COLOR)
                    .setDescription(`**GG** ${message.author}, you just leveled up to level **${user.level}**!\nContiune to chat to level up again.`)
                const sendEmbed = await message.channel.send({ embeds: [levelEmbed] });
            }
        }

        if (swearFilterOn === "true") {
            var msg = message.content.toLowerCase();
            for (let i = 0; i < swearwords["swearwords"].length; i++) {
                if (msg.includes(swearwords["swearwords"][i])) {
                    message.delete();
                    return message.channel.send("Please do not swear.").then(msg => msg.delete({ timeout: 3000 }));
                }
            }
            if (!message.content.startsWith(prefix) || message.author.bot) return;

        }
    }
}