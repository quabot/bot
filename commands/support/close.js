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
            const embed1 = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle("Do you really want to close this ticket?")
                .setDescription("React with **Close** to close and **Cancel** to cancel!")
                .setTimestamp()
            const button1 = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId('closeTicket')
                        .setLabel('Close')
                        .setStyle('SUCCESS'),
                    new discord.MessageButton()
                        .setCustomId('cancelClose')
                        .setLabel('Cancel')
                        .setStyle('DANGER'),
                );
            message.channel.send({ embeds: [embed1], components: [button1] }).then(msg => {
                function closeUpdate() {

                }
                function cancelTicket() {
                    const cancelled = new discord.MessageEmbed()
                        .setColor(colors.COLOR)
                        .setTitle(":x: Cancelled!")
                        .setTimestamp()
                    msg.edit({ embeds: [cancelled] })
                }
            })
        };
    }
}