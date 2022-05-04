const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage) {
        try {
            if (oldMessage.guild.id === null) return;
            if (newMessage.author.bot) return;

            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: oldMessage.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: oldMessage.guild.id,
                        guildName: oldMessage.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollID: 0,
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
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            newMessage.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return newMessage.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            const Events = require('../../schemas/EventsSchema')
            const eventsDatabase = await Events.findOne({
                guildId: oldMessage.guild.id
            }, (err, events) => {
                if (err) console.error(err)
                if (!events) {
                    const newEvents = new Events({
                        guildId: oldMessage.guild.id,
                        guildName: oldMessage.guild.name,
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
                        newMessage.channel.send({ embeds: [error] }).catch(err => console.log(err));
                    })
                    return newMessage.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }
            ).clone().catch(function (err) { console.log(err) });

            if (!eventsDatabase) return;
            if (!guildDatabase) return;

            const logChannel = newMessage.guild.channels.cache.get(guildDatabase.logChannelID);

            if (guildDatabase.swearEnabled === "true") {
                const { Swears } = require('../../files/swearwords');
                let msg = newMessage.content.toLowerCase();
                msg = msg.replace(/\s+/g, '');
                msg = msg.replace('.', '');
                msg = msg.replace(',', '');
                for (let i = 0; i < Swears.length; i++) {
                    if (msg.includes(Swears[i])) {
                        const SwearFound = new MessageEmbed()
                            .setDescription(`Please do not swear! One of your servers, **${newMessage.guild.name}** has a swearfilter activated.`)
                            .setColor(COLOR_MAIN)
                        newMessage.author.send({ embeds: [SwearFound] }).catch(err => {
                            console.log("DMS Disabled.");
                        })
                        newMessage.delete().catch(err => {
                            console.log("Delete swearfilter error.");
                        });

                        if (guildDatabase.logEnabled === "false") return;
                        if (logChannel) {
                            const embed = new MessageEmbed()
                                .setTitle("Swear Filter Triggered")
                                .addField("User", `${newMessage.author}`)
                                .addField("Swearword", `${Swears[i]}`)
                                .setFooter(`ID: ${newMessage.author.id}`)
                                .setColor(COLOR_MAIN)
                                
                            logChannel.send({ embeds: [embed] }).catch(err => {
                                console.log("Delete swearfilter error.");
                            });
                        }
                        return;
                    }
                }
            }

            if (!logChannel) return;

            if (guildDatabase.logEnabled === "false") return;
            if (eventsDatabase.messageUpdate === false) return;

            const embed = new MessageEmbed()
                .setTitle("💬 Message Updated!")
                
                .setFooter(`Message-ID: ${oldMessage.id}`)
                .setColor(COLOR_MAIN);

            let oldContent = String(oldMessage.content);
            let newContent = String(newMessage.content);

            if (newContent.length > 1024) newContent = "Too long for message embed.";

            if (oldMessage.content !== newMessage.content) {
                embed.addField("Content", `${oldContent} ** **`);
                embed.addField("Changed to", `${newContent} ** **`);
            }
            embed.addField("Channel", `${newMessage.channel} ** **`, true);
            if (newMessage.author) embed.addField("Author", `${newMessage.author} ** **`, true);

            logChannel.send({ embeds: [embed] }).catch(err => console.log(err));
        } catch (e) {
            return;
        }
    }
};