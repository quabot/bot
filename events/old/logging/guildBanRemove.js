const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../../commands/old/embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

const guildUserBanEmbed = new MessageEmbed()
    .setTitle("User Unbanned")
    .setColor(`GREEN`)
    

module.exports = {
    name: "guildBanRemove",
    async execute(paramater1) {

        try {
            const invite = paramater1.guild.id

            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: paramater1.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: paramater1.guild.id,
                        guildName: paramater1.guild.name,
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

            const Events = require('../../schemas/EventsSchema')
            const eventsDatabase = await Events.findOne({
                guildId: paramater1.guild.id
            }, (err, events) => {
                if (err) console.error(err)
                if (!events) {
                    const newEvents = new Events({
                        guildId: paramater1.guild.id,
                        guildName: paramater1.guild.name,
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
                    })
                    return;
                }
            }
            ).clone().catch(function (err) { console.log(err) });

            if (!eventsDatabase) return;
            if (!guildDatabase) return;

            const logChannel = paramater1.guild.channels.cache.get(guildDatabase.logChannelID);

            if (!logChannel) return;

            if (guildDatabase.logEnabled === "false") return;
            if (eventsDatabase.memberUpdate === false) return;

            guildUserBanEmbed.setDescription("User unbanned: " + `${paramater1.user.tag}`)
            guildUserBanEmbed.addField("User-ID", `${paramater1.user.id}`)

            logChannel.send({ embeds: [guildUserBanEmbed] }).catch(err => console.log(err));
        } catch (e) {
            console.log(e);
            return;
        }
    }
};