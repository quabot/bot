const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "roleUpdate",
    async execute(oldRole, newRole, client) {
        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: oldRole.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: oldRole.guild.id,
                        guildName: oldRole.guild.name,
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
                        });
                    return;
                }
            }).clone().catch(function (err) { console.log(err) });

            const Events = require('../../schemas/EventsSchema')
            const eventsDatabase = await Events.findOne({
                guildId: oldRole.guild.id
            }, (err, events) => {
                if (err) console.error(err)
                if (!events) {
                    const newEvents = new Events({
                        guildId: oldRole.guild.id,
                        guildName: oldRole.guild.name,
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
                        console.log(err);
                    })
                    return;
                }
            }
            ).clone().catch(function (err) { console.log(err) });

            if (!eventsDatabase) return;
            if (!guildDatabase) return;

            const logChannel = oldRole.guild.channels.cache.get(guildDatabase.logChannelID);

            if (!logChannel) return;

            if (guildDatabase.logEnabled === "false") return;
            if (eventsDatabase.roleUpdate === false) return;

            if (guildDatabase.logEnabled === "true") {
                if (logChannel) {
                    if (oldRole.rawPosition !== newRole.rawPosition) return;
                    const oldPerms = oldRole.permissions.toArray().join("\n");
                    const newPerms = newRole.permissions.toArray().join("\n");

                    const permUpdated = oldPerms - newPerms;

                    const embed = new MessageEmbed()
                        .setColor(`${newRole.hexColor}`)
                        .setDescription(`<@&${newRole.id}>`)
                        .setTitle('Role Updated!')
                        .setFooter(`Role ID: ${newRole.id}`)
                    if (oldRole.name !== newRole.name) {
                        embed.addField('Old Name', `${oldRole.name}`, true);
                        embed.addField('New Name', `${newRole.name}`, true);
                        embed.addField('** **', `** **`, true);
                    }
                    if (oldRole.color !== newRole.color) {
                        embed.addField('Old Color', `${oldRole.hexColor}`, true);
                        embed.addField('New Color', `${newRole.hexColor}`, true);
                        embed.addField('** **', `** **`, true);
                    }
                    if (oldRole.permissions > newRole.permissions) {
                        embed.setDescription(`**${newRole.toString()} has lost a permission!**`)
                        logChannel.send({ embeds: [embed] }).catch();

                    } else if (oldRole.permissions < newRole.permissions) {
                        embed.setDescription(`**${newRole.toString()} has been given a permission!**`)
                        logChannel.send({ embeds: [embed] }).catch();
                    } else {
                        logChannel.send({ embeds: [embed] }).catch();
                    }
                };
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
}