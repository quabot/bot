const discord = require('discord.js')
const { MessageEmbed } = require('discord.js')

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
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                    return;
                }
            });

            const logChannel = oldMember.guild.channels.cache.get(guildDatabase.logChannelID);

            if (guildDatabase.logEnabled === "false") return;
            const oldStatus = oldMember.premiumSince;
            const newStatus = newMember.premiumSince;
            const boostStatusEmbed = new MessageEmbed()
                .setTitle('Boost Status Update')
                .setDescription(`${newMember} has boosted the server!`)
                .setColor(colors.COLOR)
                .setTimestamp()
            const boostStatusEmbed2 = new MessageEmbed()
                .setTitle('Boost Status Update')
                .setDescription(`${newMember} has stopped boosting the server!`)
                .setColor(colors.COLOR)
                .setTimestamp()
            if (!oldStatus && newStatus) {
                logChannel.send({ embeds: [boostStatusEmbed]})
            }
            if (oldStatus && !newStatus) {
                logChannel.send({ embeds: [boostStatusEmbed2]})
            }

        } catch (e) {
            console.log(e);
            return;
        }
    }
}