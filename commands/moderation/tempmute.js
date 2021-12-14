const discord = require('discord.js');
const ms = require('ms');
const mongoose = require('mongoose');

const config = require('../../files/config.json');
const colors = require('../../files/colors.json');
const { errorMain, banImpossible, addedDatabase, banNoPermsUser, banNoUser, banNoTime, muteNoManageRoles, muteNoPermsUser, muteNoTime, muteNoUser } = require('../../files/embeds');

module.exports = {
    name: "tempmute",
    description: "Temporarily mute a user.",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "User to mute",
            type: "USER",
            required: true,
        },
        {
            name: "time",
            description: "Time to mute",
            type: "STRING",
            required: true,
        },
        {
            name: "reason",
            description: "Reason for mute",
            type: "STRING",
            required: false,
        }
    ],
    async execute(client, interaction) {

        try {
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

            let mutedRoleName = guildDatabase.mutedRole;
            let mainRoleName = guildDatabase.mainRole;

            const target = interaction.options.getMember('user');
            const member = interaction.options.getMember('user');
            const reasonRaw = interaction.options.getString('reason');

            let reason = "No reason specified.";

            if (!target) return interaction.reply({ embeds: [muteNoUser] });
            if (reasonRaw) reason = reasonRaw;

            let mainRole = interaction.guild.roles.cache.find(role => role.name === `${mainRoleName}`);
            let muteRole = interaction.guild.roles.cache.find(role => role.name === `${mutedRoleName}`);

            let memberTarget = interaction.guild.members.cache.get(target.id);

            const time = interaction.options.getString('time');

            if (!time) return interaction.reply({ embeds: [muteNoTime] });

            if (ms(time)) {
                memberTarget.roles.remove(mainRole.id);
                memberTarget.roles.add(muteRole.id);
                const mutedUser4 = new discord.MessageEmbed()
                    .setTitle(":white_check_mark: User tempmuted!")
                    .setDescription(`<@${memberTarget.user.id}> has been tempmuted for ${time}`)
                    .addField('Reason', `${reason}`)
                    .setColor(colors.COLOR);
                interaction.reply({ embeds: [mutedUser4] });
                setTimeout(function () {
                    memberTarget.roles.add(mainRole.id);
                    memberTarget.roles.remove(muteRole.id);
                    const mutedUser23 = new discord.MessageEmbed()
                        .setTitle(":white_check_mark: User auto-unmuted")
                        .setDescription(`<@${memberTarget.user.id}> has been unmuted after ${time}!`)
                        .addField('Mute Reason', `${reason}`)
                        .setColor(colors.COLOR);
                    interaction.channel.send({ embeds: [mutedUser23] });
                }, ms(time));
            } else {
                return interaction.reply({ embeds: { muteNoTime } });
            }

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
                        banCount: 0,
                        warnCount: 0,
                        muteCount: 1,
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
                muteCount: userDatabase.muteCount + 1
            });

            const Mutes = require('../../schemas/MuteSchema');
            const newMutes = new Mutes({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                muteReason: reason,
                muteTime: new Date(),
            });
            newMutes.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [errorMain] });
                });

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;

                const embed = new discord.MessageEmbed()
                    .setColor(colors.MUTE_COLOR)
                    .setTitle('User Tempmuted')
                    .addField('User', `${target}`)
                    .addField('User ID', `${target.id}`)
                    .addField('Muted by', `${interaction.user}`)
                    .addField('Time', `${time}`)
                    .addField('Reason', `${reason}`)
                logChannel.send({ embeds: [embed] });
            } else {
                return;
            }
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}