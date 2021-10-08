const discord = require('discord.js');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const Guild = require('../../models/guild');

const { errorMain, addedDatabase, ticketsDisabled } = require('../../files/embeds');

module.exports = {
    name: "close",
    aliases: ["closeticket", "ticketclose"],
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
                    enableSwearFilter: true,
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
            message.channel.send("The tickets category does not exist, creating it now...");
            message.guild.channels.create(ticketsCatName, { type: "GUILD_CATEGORY" });
            return message.channel.send(":white_check_mark: Succes! Please run the command again.")
        }

        let ticketChannel = message.guild.channels.cache.find(channel => channel.name === `${message.author.username.toLowerCase()}-${message.author.discriminator}`);
        if (!ticketChannel.name === `${message.author.username.toLowerCase()}-${message.author.discriminator}`) return message.reply("This is not your ticket!")

        if (ticketChannel === undefined) {
            message.channel.send("You do not have a ticket! Create one using `!ticket`!");
        } else {
            message.channel.send("Are you sure you want to close your ticket? Type `close` within 10 seconds to confirm.");
            const filter = m => m.author.id === message.author.id;
            const collector = message.channel.createMessageCollector({ filter, max: 1, time: 10000 });
            collector.on('collect', m => {
                message.channel.send("Do you want to delete the ticket or archive it? Enter `delete` or `archive`");
                collector.on('collect', m => {
                    if (!m.content.toLowerCase() === "close") {
                        message.channel.send(":x: Cancelled!");
                    }
                });

                collector.on('collect', m => {
                    message.channel.send("Do you want to delete the ticket or archive it? Enter `delete` or `archive`");
                    const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 });
                    collector.on('collect', m => {
                        if (m.content.toLowerCase() === "delete") {
                            message.channel.send(":x: Deleting ticket in 5 seconds!");
                        } else {
                            if (m.content.toLowerCase() === "close") {
                                message.channel.send("Closing tickets is coming soon!");
                                return;
                            } else {
                                message.reply("Invalid answer, :x: cancelled!");
                                return;
                            }
                        }
                    });
                    return message.channel.send(":x: Cancelled!");
                });
            })
        }
    }
}