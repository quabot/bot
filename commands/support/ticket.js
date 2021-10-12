const discord = require('discord.js');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const Guild = require('../../models/guild');

const { errorMain, addedDatabase, ticketsDisabled } = require('../../files/embeds');





// topics, closed category








module.exports = {
    name: "ticket",
    aliases: ["tickets", "ct", "maketicket", "createticket"],
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return message.delete({ timeout: 5000 });

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
                    enableLog: false,
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

        if (settings.ticketEnabled === "false") return message.channel.send({ embeds: [ticketsDisabled] });

        let ticketsCatName = settings.ticketChannelName;

        if (ticketsCatName === "undefined") {
            let ticketsCatName = "Tickets";
        }

        let category = message.guild.channels.cache.find(cat => cat.name === ticketsCatName);
        if (category === undefined) {
            message.channel.send("That category does not exist, creating one now...");
            message.guild.channels.create(ticketsCatName, { type: "GUILD_CATEGORY" });
            return message.channel.send(":white_check_mark: Succes! Please run the command again.")
        }

        let ticketChannel = message.guild.channels.cache.find(channel => channel.name === `${message.author.username.toLowerCase()}-${message.author.discriminator}`);

        if (ticketChannel === undefined) {
            message.channel.send("Creating your ticket now...");
            message.guild.channels.create(`${message.author.username}-${message.author.discriminator}`, { parent: category });
            message.channel.send(`:white_check_mark: Succesfully created your ticket!`);
            setTimeout(() => {
                let ticketChannel2 = message.guild.channels.cache.find(channel => channel.name === `${message.author.username.toLowerCase()}-${message.author.discriminator}`);
                ticketChannel2.permissionOverwrites.edit(message.author, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true
                })

                ticketChannel2.send(`Hello <@${message.author.id}>, please wait, staff will be with you shortly.`);
            }, 1000);
        } else {
            message.channel.send("You already have a ticket! You can find it here: <#" + ticketChannel + ">");
            ticketChannel.send("<@" + message.author.id + ">, here is your ticket!").then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000);;
            })
            return
        }
    }
}