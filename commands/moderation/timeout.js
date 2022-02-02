const discord = require('discord.js');
const mongoose = require('mongoose');
const ms = require('ms');

const config = require('../../files/settings.json');
const colors = require('../../files/colors.json');
const { errorMain, timeoutNoTime, addedDatabase } = require('../../files/embeds');

module.exports = {
    name: "timeout",
    description: "Timeout/mute a user (replacement for /mute).",
    permission: "MODERATE_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "The user to timeout.",
            type: "USER",
            required: true,
        },
        {
            name: "time",
            description: "The time to timeout the user.",
            type: "STRING",
            required: true,
        },
        {
            name: "reason",
            description: "The reason for timing out the user.",
            type: "STRING",
            required: false,
        },
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
                        levelEnabled: false,
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

            const user = interaction.options.getMember('user');
            const member = interaction.options.getMember('user');
            const time = interaction.options.getString('time');

            let reason = interaction.options.getString('reason');
            if (reason === null) reason = "No reason specified."

            if (ms(time)) {
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
                    muteCount: userDatabase.muteCount + 1
                });

                const Mutes = require('../../schemas/MuteSchema');
                const newMute = new Mutes({
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    userId: user.id,
                    muteReason: reason,
                    muteTime: new Date(),
                });
                newMute.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [errorMain] });
                    });

                const sendEmbed = new discord.MessageEmbed().setTitle(":white_check_mark: User timed-out!").setDescription(`Succesfully timed out ${user} for ${time}, with the reason: ${reason}`).setTimestamp().setColor(colors.COLOR);

                user.timeout(ms(time), `${reason}`)
                    .catch(err => {
                        const noPermstotimeout = new discord.MessageEmbed().setTitle(":x: Failed to timeout!").setDescription(`I cannot timeout that user.`).setTimestamp().setColor(colors.COLOR);
                        return interaction.channel.send({ embeds: [noPermstotimeout] });
                    });
                interaction.reply({ embeds: [sendEmbed] });
                const unable = new discord.MessageEmbed()
                    .setDescription(`Could not send a DM to that user.`)
                    .setColor(colors.COLOR);
                const timoutuseer = new discord.MessageEmbed()
                    .setDescription(`You were timed out on one of your servers, **${interaction.guild.name}**.`)
                    .addField("Timed Out By", `${interaction.user}`)
                    .addField("Time", `${time}`)
                    .addField("Reason", `${reason}`)
                    .setColor(colors.COLOR);
                user.send({ embeds: [timoutuseer] }).catch(e => {
                    interaction.channel.send({ embeds: [unable] });
                });

                if (guildDatabase.logEnabled === "true") {
                    const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                    if (!logChannel) return;

                    const embed = new discord.MessageEmbed()
                        .setColor(colors.EMOJI_DELETE)
                        .setTitle('User Timed Out')
                        .addField('Username', `${user.user.username}`)
                        .setFooter(`User ID ${user.id}`)
                        .addField('Timed Out by', `${interaction.user}`)
                        .addField("Duration", `${time}`)
                        .addField('Reason', `${reason}`);
                    logChannel.send({ embeds: [embed], split: true }).catch(err => logChannel.send("There was an error! The reason for kicking probably exceeded the 1024 character limit."));
                } else {
                    return;
                }
            } else {
                interaction.reply({ embeds: [timeoutNoTime] })
            }

        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}