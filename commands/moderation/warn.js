const discord = require("discord.js");
const mongoose = require('mongoose');

const config = require('../../files/settings.json');
const colors = require('../../files/colors.json');

const unable = new discord.MessageEmbed()
    .setDescription(`Could not send a DM to that user.`)
    .setColor(colors.COLOR);

const { errorMain, warnNoUserToWarn, warnNotHigherRole, addedDatabase } = require('../../files/embeds');

module.exports = {
    name: "warn",
    description: "Warn a user.",
    permission: "KICK_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "User to warn",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Reason for warning",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {
        try {


            let reason = "No reason specified";

            const reasonRaw = interaction.options.getString('reason');
            if (reasonRaw) reason = reasonRaw;

            const member = interaction.options.getMember('user');

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
                        warnCount: 1,
                        muteCount: 0,
                        afk: false,
                        afkStatus: "none",
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
                warnCount: userDatabase.warnCount + 1
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
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        swearEnabled: false,
transcriptChannelID: "none"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });

            const Warns = require('../../schemas/WarnSchema');
            const newWarns = new Warns({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                warnReason: reason,
                warnTime: new Date().getTime(),
                warnId: userDatabase.warnCount + 1,
                warnedBy: interaction.user.id,
                warnChannel: interaction.channel.id,
                active: true,
            });
            newWarns.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [errorMain] });
                });
            const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);

            if (!member)
                return interaction.reply({ embeds: [warnNoUserToWarn] });

            if (interaction.member.roles.highest.position < member.roles.highest.position)
                return interaction.reply({ embeds: [warnNotHigherRole] });

            const rRaw = interaction.options.getString('reason');
            if (rRaw.length > 1) reason = rRaw;

            const warnedEmbed = new discord.MessageEmbed()
                .setDescription(`${member} was warned\nReason: **${reason}**`)
                .setFooter(`Warn-ID: ${userDatabase.warnCount + 1}`)
                .setColor(colors.COLOR);
            interaction.reply({ embeds: [warnedEmbed] });
            const youWereWarned = new discord.MessageEmbed()
                .setDescription(`You were warned on one of your servers, **${interaction.guild.name}**.`)
                .addField("Warned By", `${interaction.user}`)
                .addField("Reason", `${reason}`)
                .setFooter(`Warn-ID: ${userDatabase.warnCount + 1}`)
                .setColor(colors.COLOR);
            member.send({ embeds: [youWereWarned] }).catch(e => { 
                interaction.channel.send({ embeds: [unable] });
            });

            if (guildDatabase.logEnabled === "true") {
                if (!logChannel) {
                    return
                } else {
                    const embed = new discord.MessageEmbed()
                        .setColor(colors.WARN_COLOR)
                        .setTitle('User Warned')
                        .addField('Username', `${member.user.username}`)
                        .addField('User ID', `${member.id}`)
                        .addField('Warned by', `${interaction.user}`)
                        .addField('Reason', `${reason}`);

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