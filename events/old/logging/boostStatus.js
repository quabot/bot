const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports  = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        if (oldMember.guild.id === null) return;
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
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!eventsDatabase) return;
            if (!guildDatabase) return;

            const logChannel = oldMember.guild.channels.cache.get(guildDatabase.logChannelID);

            if (guildDatabase.logEnabled === "false") return;

            const oldStatus = oldMember.premiumSince;
            const newStatus = newMember.premiumSince;
            const boostStatusEmbed = new MessageEmbed()
                .setTitle('Boost Added')
                .setDescription(`${newMember} has boosted the server!`)
                .setColor(COLOR_MAIN)
                
            const boostStatusEmbed2 = new MessageEmbed()
                .setTitle('Boost Removed')
                .setDescription(`${newMember} has stopped boosting the server!`)
                .setColor(COLOR_MAIN)
                
            if (!oldStatus && newStatus) {
                logChannel.send({ embeds: [boostStatusEmbed]}).catch(err => console.log(err));
            }
            if (oldStatus && !newStatus) {
                logChannel.send({ embeds: [boostStatusEmbed2]}).catch(err => console.log(err));
            }

        } catch (e) {
            return;
        }
    }
}