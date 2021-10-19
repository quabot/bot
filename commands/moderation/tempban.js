const discord = require('discord.js');
const ms = require('ms');
const mongoose = require('mongoose');

const Guild = require('../../models/guild');

const config = require('../../files/config.json');
const User = require('../../models/user');
const colors = require('../../files/colors.json');
const {errorMain, banImpossible, addedDatabase, banNoPermsUser, banNoUser, banNoTime} = require('../../files/embeds');

module.exports = {
    name: "tempban",
    description: "This command allows you to temporarily ban a user from the guild your in.",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "user",
            description: "The user to ban.",
            type: "USER",
            required: true,
        },
        {
            name: "time",
            description: "The time to ban the user.",
            type: "STRING",
            required: true,
        },
        {
            name: "reason",
            description: "The reason to ban the user. (optional)",
            type: "STRING",
            required: false,
        }
    ],
    async execute(client, interaction) {

        const member = interaction.options.getMember('user');
        const time = interaction.options.getString('time');
        const reasonRaw = interaction.options.getString('reason');
        let reason = "No reason specified.";

        if (!member) return interaction.reply({embeds: [banNoUser]});
        if (!time) return interaction.reply({embeds: [banNoTime]});
        if (reasonRaw) reason = reasonRaw;

        const settings = await Guild.findOne({
            guildID: interaction.guild.id
        }, (err, guild) => {
            if (err) interaction.reply({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    logChannelID: none,
                    enableLog: true,
                    enableSwearFilter: false,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: none,
                    suggestEnabled: true,
                    suggestChannelID: none,
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                    closedTicketCategoryName: "Closed Tickets",
                    welcomeEnabled: true,
                    welcomeChannelID: none,
                    enableNSFWContent: false,
                });
        
                newGuild.save()
                    .catch(err => interaction.followUp({ embeds: [errorMain] }));
        
                return interaction.followUp({ embeds: [addedDatabase] });
            }
        });
        
        if (ms(time)) {
            member.ban({ reason: reason }).catch(err => {
                interaction.channel.send({embeds: [banImpossible]});
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
                if (settings.enableLog === "true") {
                    const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);
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

        User.findOne({
            guildID: interaction.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err) console.error(err);

            if (!User) {
                const newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    guildID: interaction.guild.id,
                    userID: member.id,
                    muteCount: 0,
                    warnCount: 0,
                    kickCount: 0,
                    banCount: 1
                });

                await newUser.save()
                    .catch(err => interaction.followUp({ embeds: [errorMain] }));
            } else {
                User.updateOne({
                    banCount: User.banCount + 1
                })
                    .catch(err => interaction.followUp({ embeds: [errorMain] }));
            };
        });

        if (settings.enableLog === "true") {
            const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);
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