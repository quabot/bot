const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {

        const Guild = require('../../schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: member.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: member.guild.id,
                    guildName: member.guild.name,
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
                        welcomeEmbed: true,
                        pollEnabled: true,
                    
                    reportEnabled: true,
                    suggestEnabled: true,
                    ticketEnabled: true,
                    welcomeEnabled: true,
                        leaveEnabled: true,
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
                    });
                return;
            }
        }).clone().catch(function (err) { console.log(err) });

        const Events = require('../../schemas/EventsSchema')
        const eventsDatabase = await Events.findOne({
            guildId: member.guild.id
        }, (err, events) => {
            if (err) console.error(err)
            if (!events) {
                const newEvents = new Events({
                    guildId: member.guild.id,
                    guildName: member.guild.name,
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

        const logChannel = member.guild.channels.cache.get(guildDatabase.logChannelID);
        const joinChannel = member.guild.channels.cache.get(guildDatabase.welcomeChannelID);

        if (guildDatabase.roleEnabled === "true") {
            let mainRoleId = guildDatabase.mainRole;
            if (!mainRoleId) return;
            let mainRole = member.guild.roles.cache.find(role => role.id === `${mainRoleId}`);
            let memberTarget = member.guild.members.cache.get(member.id);

            if (mainRole) {
                memberTarget.roles.add(mainRole.id).catch(err => console.log(err));
            }
        }
        if (eventsDatabase.joinMessages === false) return;
        if (guildDatabase.logEnabled === "false") return;


        let joinmessage = guildDatabase.joinMessage;

        if (joinmessage === undefined) joinmessage = "Welcome {user} to **{guild-name}**!";

        joinmessage = joinmessage.replace("{user}", member);
        joinmessage = joinmessage.replace("{user-name}", member.user.username);
        joinmessage = joinmessage.replace("{user-discriminator}", member.user.discriminator);
        joinmessage = joinmessage.replace("{guild-name}", member.guild.name);
        joinmessage = joinmessage.replace("{members}", member.guild.memberCount);

        if (guildDatabase.logEnabled === "true") {
            if (logChannel) {
                const embed = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle('Member joined!')
                    .setAuthor(`${member.user.tag} just joined!`, member.user.avatarURL())
                    .addField('User', `${member.user}`)
                    .addField('User-ID', `${member.user.id}`)
                logChannel.send({ embeds: [embed] }).catch();
            };
        }

        if (guildDatabase.welcomeEnabled === "true") {
            if (joinChannel) {
                const welcomeEmbed = new MessageEmbed()
                    .setAuthor(`${member.user.tag} just joined!`, member.user.avatarURL())
                    .setDescription(`${joinmessage}`)
                    .setColor(`GREEN`);
                joinChannel.send({ embeds: [welcomeEmbed] }).catch();
            }
        }
    }
}