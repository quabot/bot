const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "guildMemberUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldMember, newMember) {

        if (!oldMember.guild.id) return;

        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: oldMember.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: oldMember.guild.id,
                        guildName: oldMember.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                    modEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "none",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
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
                guildId: oldMember.guild.id
            }, (err, events) => {
                if (err) console.error(err)
                if (!events) {
                    const newEvents = new Events({
                        guildId: oldMember.guild.id,
                        guildName: oldMember.guild.name,
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
                        return;
                    })
                    return;
                }
            }
            ).clone().catch(function (err) { console.log(err) });

            if (!eventsDatabase) return;
            if (!guildDatabase) return;

            const logChannel = oldMember.guild.channels.cache.get(guildDatabase.logChannelID);

            if (!logChannel) return;

            if (guildDatabase.logEnabled === "false") return;
            if (eventsDatabase.memberUpdate === false) return;

            if (oldMember.nickname !== newMember.nickname) {
                let oldNick = oldMember.nickname;
                let newNick = newMember.nickname;
                if (oldNick === null) oldNick = "none";
                if (newNick === null) newNick = "none";

                const embedNickChange = new MessageEmbed()
                    .setTitle("Nickname changed")
                    .addField("Old Nickname", `${oldNick}`)
                    .addField("New Nickname", `${newNick}`)
                    .addField("User", `${newMember}`)
                    
                    .setFooter(`User-ID: ${newMember.user.id}`)
                    .setColor(COLOR_MAIN)
                logChannel.send({ embeds: [embedNickChange] }).catch(( err => { } ))
                return;
            }
            if (oldMember._roles !== newMember._roles) {
                if (oldMember._roles > newMember._roles) {
                    const roleRemoved = new MessageEmbed()
                        .setTitle('Role(s) Removed')
                        .addField("User", `${newMember}`)
                        .setDescription(`<@&${oldMember._roles.filter(n => !newMember._roles.includes(n)).join('>\n<@&')}>`)
                        .setColor(COLOR_MAIN)
                        .setFooter(`User ID: ${newMember.id}`)
                        ;
                    logChannel.send({ embeds: [roleRemoved] }).catch(( err => { } ))
                }
                if (oldMember._roles < newMember._roles) {
                    const roleRemoved = new MessageEmbed()
                        .setTitle('Role(s) Given')
                        .addField("User", `${newMember}`)
                        .setDescription(`<@&${newMember._roles.filter(n => !oldMember._roles.includes(n)).join('>\n<@&')}>`)
                        .setColor(COLOR_MAIN)
                        .setFooter(`User ID: ${newMember.id}`)
                        ;
                    logChannel.send({ embeds: [roleRemoved] }).catch(( err => { } ))
                }
            }
        } catch (e) {
            console.log(e)
            return;
        }
    }
};