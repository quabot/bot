const discord = require("discord.js");
const mongoose = require('mongoose');

const config = require('../../files/settings.json');
const colors = require('../../files/colors.json');

const unable = new discord.MessageEmbed()
    .setDescription(`Could not send a DM to that user.`)
    .setColor(colors.COLOR);

const { errorMain, warnNoUserToWarn, warnNotHigherRole, addedDatabase } = require('../../files/embeds');

module.exports = {
    name: "clear-warning",
    description: "Clear warnings.",
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
            name: "id",
            description: "The warn ID.",
            type: "INTEGER",
            required: true,
        },
    ],
    async execute(client, interaction) {
        try {

            const notFound = new discord.MessageEmbed()
                .setDescription("Could not find a warn with that ID.")
                .setColor(colors.COLOR)
                .setFooter("Warns removal was introduced in version 2.0.3, any warns made before that version cannot be removed.")
            const id = interaction.options.getInteger('id');

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

            const Warns = require('../../schemas/WarnSchema');
            const warnDB = await Warns.findOne({
                userId: member.id,
                guildId: interaction.guild.id,
                warnId: id,
            }, (err, warns) => {
                if (err) console.error(err);
                if (!warns) { }
            });

            if (!warnDB) return interaction.reply({ embeds: [notFound] });

            var timestamp = parseInt(warnDB.warnTime);
            var date = new Date(timestamp);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();

            const infoEmbed = new discord.MessageEmbed()
                .setTitle("Removing warn")
                .addField("User", `${member}`, true)
                .addField("Reason", `${warnDB.warnReason}`, true)
                .addField("Warned by", `<@${warnDB.warnedBy}>`, true)
                .addField("Warned at", `${year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds}`, true)
                .addField("Warn ID", `${warnDB.warnId}`, true)
                .addField("Warn Channel", `<#${warnDB.warnChannel}>`, true)
                .setColor(colors.COLOR)
                .setTimestamp(warnDB.warnTime)
            interaction.reply({ embeds: [infoEmbed] });
            const embed = new discord.MessageEmbed()
                .setDescription(`Warn with id \`${warnDB.warnId}\` is now removed from ${member}.`)
                .setColor(colors.COLOR)
            interaction.channel.send({ embeds: [embed]})
            await warnDB.updateOne({
                active: false,
            });

            if (guildDatabase.logEnabled === "true") {
                if (!logChannel) {
                    return
                } else {
                    const embed = new discord.MessageEmbed()
                        .setColor(colors.WARN_COLOR)
                        .setTitle('Warn removed')
                        .addField('Username', `${member}`)
                        .setFooter(`User ID ${member.id}`)
                        .addField('Warn-ID', `${warnDB.warnId}`)
                        .addField('Reason', `${warnDB.warnReason}`);
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