const discord = require('discord.js');
const mongoose = require('mongoose');
const ms = require('ms');

const config = require('../../files/settings.json');
const colors = require('../../files/colors.json');
const { errorMain, timeoutNoTime, addedDatabase } = require('../../files/embeds');

module.exports = {
    name: "untimeout",
    description: "Remove a user's timeout.",
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
            const member = interaction.options.getMember('user')
            const sendEmbed = new discord.MessageEmbed().setTitle(":white_check_mark: User un-timed-out!").setDescription(`Succesfully untimedout ${user}`).setTimestamp().setColor(colors.COLOR);

            user.timeout(1, `Timeout removed.`)
                .catch(err => {
                    const noPermstotimeout = new discord.MessageEmbed().setTitle(":x: Failed to timeout!").setDescription(`I cannot timeout that user.`).setTimestamp().setColor(colors.COLOR);
                    return interaction.channel.send({ embeds: [noPermstotimeout] });
                })
            interaction.reply({ embeds: [sendEmbed] });
            const unable = new discord.MessageEmbed()
                .setDescription(`Could not send a DM to that user.`)
                .setColor(colors.COLOR);
            const timoutuseer = new discord.MessageEmbed()
                .setDescription(`Your timeout was removed on one of your servers, **${interaction.guild.name}**.`)
                .setColor(colors.COLOR);
            user.send({ embeds: [timoutuseer] }).catch(e => {
                interaction.channel.send({ embeds: [unable] });
            });

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;

                const embed = new discord.MessageEmbed()
                    .setColor(colors.EMOJI_DELETE)
                    .setTitle('User Timeout removed')
                    .addField('Username', `${user.user.username}`)
                    .setFooter(`User ID ${user.id}`)
                    .addField('Removed By', `${interaction.user}`)
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