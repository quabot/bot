const discord = require('discord.js');
const ms = require('ms');
const mongoose = require('mongoose');

const config = require('../../files/config.json');
const colors = require('../../files/colors.json');
const { errorMain, banImpossible, addedDatabase, banNoUser, banNoTime } = require('../../files/embeds');

module.exports = {
    name: "tempban",
    description: "Temporarily ban a user.",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "User to ban",
            type: "USER",
            required: true,
        },
        {
            name: "time",
            description: "Time to ban",
            type: "STRING",
            required: true,
        },
        {
            name: "reason",
            description: "Reason to ban",
            type: "STRING",
            required: false,
        }
    ],
    async execute(client, interaction) {

        const member = interaction.options.getMember('user');
        const time = interaction.options.getString('time');
        const reasonRaw = interaction.options.getString('reason');
        let reason = "No reason specified.";

        if (!member) return interaction.reply({ embeds: [banNoUser] });
        if (!time) return interaction.reply({ embeds: [banNoTime] });
        if (reasonRaw) reason = reasonRaw;

        const User = require('../../schemas/UserSchema');
        const userDatabase = await User.findOne({
            userId: member.id,
            guildId: interaction.guild.id,
        }, (err, user) => {
            if (err) console.error(err);
            if (!user) {
                const newUser = new User({
                    userId: member.id,
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    typeScore: 0,
                    kickCount: 0,
                    banCount: 1,
                    warnCount: 0,
                    muteCount: 0,
                });
                newUser.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [errorMain] });
                    });
                return interaction.channel.send({ embeds: [addedDatabase] });
            }
        });
        await userDatabase.updateOne({
            banCount: userDatabase.banCount + 1
        });

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

        const Bans = require('../../schemas/BanSchema');
        const newBans = new Bans({
            guildId: interaction.guild.id,
            guildName: interaction.guild.name,
            userId: member.id,
            banReason: reason,
            banTime: new Date(),
        });
        newBans.save()
            .catch(err => {
                console.log(err);
                interaction.channel.send({ embeds: [errorMain] });
            });

        if (ms(time)) {
            member.ban({ reason: reason }).catch(err => {
                interaction.channel.send({ embeds: [banImpossible] });
                let reason = ":x: Ban failed.";
                return;
            });
            const embed = new discord.MessageEmbed()
                .setTitle("User Tempbanned")
                .setDescription(`${member} was tempbanned for **${time}**.\n**Reason:** ${reason}`)
                .setColor(colors.COLOR)
            interaction.reply({ embeds: [embed] });
            setTimeout(function () {
                interaction.guild.members.unban(member.id);
                const unbannedAfter = new discord.MessageEmbed()
                    .setDescription(`${member} was unbanned after **${time}**!`)
                    .setColor(colors.COLOR);
                interaction.followUp({ embeds: [unbannedAfter] });
                if (guildDatabase.logEnabled === "true") {
                    const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                    if (!logChannel) {
                        return;
                    } else {
                        logChannel.send({ embeds: [unbannedAfter] });
                    };
                }
            }, ms(time));
        } else {
            return interaction.reply({ embeds: [banNoTime] });
        }
        if (guildDatabase.logEnabled === "true") {
            const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!logChannel) {
                return;
            } else {
                const embed = new discord.MessageEmbed()
                    .setColor(colors.BAN_COLOR)
                    .setTitle('User Tempbanned')
                    .addField('Username', `${member}`)
                    .addField('User ID', `${member.id}`)
                    .addField('Banned by', `${interaction.user}`)
                    .addField('Reason', `${reason}`)
                    .addField('Time', `${time}`);
                return logChannel.send({ embeds: [embed] });
            };
        }
    }
}