const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "messageDelete",
    async execute(message) {
        try {
            if (message.guild.id === null) return;

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
                        closedTicketCategory: "Tickets",
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
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        transcriptChannelID: "none"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                }
            }).clone().catch(function (err) { console.log(err) });
         
            const Events = require('../../schemas/EventsSchema')
            const eventsDatabase = await Events.findOne({
                guildId: message.guild.id
            }, (err, events) => {
                if (err) console.error(err)
                if (!events) {
                    const newEvents = new Events({
                        guildId: message.guild.id,
                        guildName: message.guild.name,
                        joinMessages: true,
                        leaveMessages: true,
                        channelCreateDelete: true,
                        channelUpdate: true,
                        emojiCreateDelete: true,
                        emojiUpdate: true,
                        inviteCreateDelete: true,
                        messageDelete: true,
                        messageUpdate: true,
                        roleCreateDelete: true,
                        roleUpdate: true,
                        voiceState: false,
                        voiceMove: false,
                        memberUpdate: true,
                        quabotLogging: true
                    })
                    newEvents.save().catch(err => {
                        console.log(err)
                        interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                    })
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                }
            }
            ).clone().catch(function (err) { console.log(err) });

            if (!eventsDatabase) return;
            if (!guildDatabase) return;

            const logChannel = message.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!logChannel) return;
            if (eventsDatabase.messageDelete === false) return;
            if (guildDatabase.logEnabled === "false") return;

            const embed = new MessageEmbed()
                .setTitle("🗑️ Message Deleted!")
                .setTimestamp()
                .setFooter(`Message-ID: ${message.id}`)
                .setColor(`YELLOW`);
            
            let content = String(message.content);

            if (content.length > 1024) content = "Could not fit content in the embed!";

            if (message.content === null || message.content === '') {
                embed.addField("Content:", "No content found!", true);
            } else {
                embed.addField("Content", `${content} ** **`);
            }
            embed.addField("Channel", `${message.channel} ** **`, true);
            if (message.author === null || message.author === '') { } else {
                embed.addField("Author", `${message.author} ** **`, true);
            }
            if (message.attachments !== null) {
                message.attachments.map(getUrls);
                function getUrls(item) {
                    embed.addField(`**Attachment:**`, `${[item.url].join(" ")}`)
                }
            }
            logChannel.send({ embeds: [embed] }).catch(err => console.log("Error!"));
        } catch (e) {
            return;
        }
    }
};