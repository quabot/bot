const colors = require('../../files/colors.json');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
const consola = require('consola'); // for logging
const { errorMain, addedDatabase } = require('../../files/embeds.js');

module.exports = {
    name: "guildMemberUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldMember, newMember) {

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
                        closedTicketCategory: "Closed Tickets",
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

            const guildMemberUpdateEmbed = new MessageEmbed()
                .setTitle('Role Added/Removed')
                .setAuthor(newMember.user.username + '#' + newMember.user.discriminator, newMember.user.displayAvatarURL)
                .setColor(colors.COLOR)
                .addField('Old Roles', `<@&${oldMember._roles.join('>\n<@&')}>`)
                .addField('New Roles', `<@&${newMember._roles.join('>\n<@&')}>`)
                .setFooter(`Member ID: ${newMember.id}`)
                .setTimestamp();
            logChannel.send({ embeds: [guildMemberUpdateEmbed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }


    }
};