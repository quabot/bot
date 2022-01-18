const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, kickNoPermsClient, kickNoUser, kickNoPermsUser, kickImpossible } = require('../../files/embeds');


module.exports = {
    name: "kick",
    description: "Kick a member.",
    permission: "KICK_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "User to kick",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Reason for kick",
            type: "STRING",
            required: false,
        }
    ],
    async execute(client, interaction) {

        try {


            const member = interaction.options.getMember('user');
            const reasonRaw = interaction.options.getString('reason');
            let reason = "No reason specified.";

            if (!member) return interaction.reply({ embeds: [kickNoUser] });
            if (reasonRaw) reason = reasonRaw;

            const userKicked = new discord.MessageEmbed()
                .setTitle("User Kicked")
                .setDescription(`${member} was kicked.\n**Reason:** ${reason}`)
                .setColor(colors.KICK_COLOR)

            member.kick(reason).catch(err => {
                interaction.channel.send({ embeds: [kickImpossible] });
                console.log(err);
                return;
            });
            const unable = new discord.MessageEmbed()
                .setDescription(`Could not send a DM to that user.`)
                .setColor(colors.COLOR);
            const youWereKicked = new discord.MessageEmbed()
                .setDescription(`You were kicked from one of your servers, **${interaction.guild.name}**.`)
                .addField("Kicked By", `${interaction.user}`)
                .addField("Reason", `${reason}`)
                .setColor(colors.COLOR);
            member.send({ embeds: [youWereKicked] }).catch(e => {
                interaction.channel.send({ embeds: [unable] });
            });
            interaction.reply({ embeds: [userKicked] }).catch(err => interaction.followUp("There was an error! The your reason for kick probably exceeded the 1024 character limit."))

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
                        kickCount: 1,
                        banCount: 0,
                        warnCount: 0,
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
                kickCount: userDatabase.kickCount + 1
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

            const Kicks = require('../../schemas/KickSchema');
            const newKicks = new Kicks({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                kickReason: reason,
                kickTime: new Date(),
            });
            newKicks.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [errorMain] });
                });

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;

                const embed = new discord.MessageEmbed()
                    .setColor(colors.KICK_COLOR)
                    .setTitle('User Kicked')
                    .addField('Username', `${member.user.username}`)
                    .addField('User ID', `${member.id}`)
                    .addField('Kicked by', `${interaction.user}`)
                    .addField('Reason', `${reason}`);
                logChannel.send({ embeds: [embed], split: true }).catch(err => logChannel.send("There was an error! The reason for kicking probably exceeded the 1024 character limit."));
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