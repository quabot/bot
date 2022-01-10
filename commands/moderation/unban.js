const discord = require('discord.js');
const mongoose = require('mongoose');

const config = require('../../files/settings.json');
const colors = require('../../files/colors.json');

const { errorMain, notBanned, addedDatabase, unbanNoUser } = require('../../files/embeds');


module.exports = {
    name: "unban",
    description: "Unban a user.",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "userid",
            description: "User-ID to unban",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {
        try {
            
            
            const member = interaction.options.getString('userid');

            if (!member) return interaction.reply({ embeds: [unbanNoUser] });
            let bannedMember;
            try {
                bannedMember = await client.users.cache.get(member);
            } catch (e) {
                if (!bannedMember) return interaction.reply({ embeds: [unbanNoUser] });
            }

            try {
                await interaction.guild.bans.fetch(bannedMember);
            } catch (e) {
                interaction.reply({ embeds: [notBanned] });
                return;
            }

            try {
                interaction.guild.members.unban(member)
                const embed1 = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setDescription(`:white_check_mark: <@${member}> has been unbanned.`)
                interaction.reply({ embeds: [embed1] })
            } catch (e) {
                console.log(e.message)
            }

            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
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
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });

            const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);

            if (guildDatabase.logEnabled === "true") {
                if (!logChannel) {
                    return;
                } else {
                    const embed = new discord.MessageEmbed()
                        .setColor(colors.UNBAN_COLOR)
                        .setTitle('User Unban')
                        .addField('Username', `<@${member}>`)
                        .addField('User ID', `${member}`)
                        .addField('Unbanned by', `${interaction.user}`)
                    return logChannel.send({ embeds: [embed] });
                };
            }
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}
