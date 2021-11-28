const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const { errorMain, addedDatabase } = require('../../files/embeds');

const noValidChannel = new discord.MessageEmbed()
    .setDescription(":x: Please enter a valid text channel to unlock!")
    .setColor(colors.COLOR)
    .setTimestamp()

module.exports = {
    name: "unlock",
    description: "By using this command you will be able to unlock a channel",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "channel",
            description: "The amount of messages to clear.",
            type: "CHANNEL",
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
                        closedTicketCategory: "Tickets",
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

            const channel = interaction.options.getChannel('channel');

            let mainRoleName = guildDatabase.mainRole;
            let mainRole = interaction.guild.roles.cache.find(role => role.name === `${mainRoleName}`);

            if (!channel) {
                const lockChannel = interaction.channel;
                lockChannel.permissionOverwrites.edit(mainRole, {
                    SEND_MESSAGES: true
                });
                lockChannel.permissionOverwrites.edit(interaction.guild.id, {
                    SEND_MESSAGES: true
                });
                const unlockedEmbed = new discord.MessageEmbed()
                    .setTitle(":unlock: Channel Unlocked!")
                    .setDescription(`This channel was unlocked by ${interaction.user}.`)
                    .setColor(colors.COLOR)
                    .setTimestamp()
                interaction.reply({ embeds: [unlockedEmbed] });
                if (guildDatabase.logEnabled === "true") {
                    const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                    if (!logChannel) return;
                    const embed = new discord.MessageEmbed()
                        .setColor(colors.CLEAR_COLOR)
                        .setTitle('Channel Unlocked')
                        .addField('Channel', `${interaction.channel}`)
                        .addField('Unlocked by', `${interaction.user}`)
                        .setTimestamp();
                    logChannel.send({ embeds: [embed] });
                } else {
                    return;
                }
            } else if (channel) {
                if (channel.type !== "GUILD_TEXT") {
                    return interaction.reply({ embeds: [noValidChannel] });
                }
                channel.permissionOverwrites.edit(mainRole, {
                    SEND_MESSAGES: true
                });
                channel.permissionOverwrites.edit(interaction.guild.id, {
                    SEND_MESSAGES: true
                });
                const unlockedChannelEmbed = new discord.MessageEmbed()
                    .setTitle(":unlock: Channel Unlocked!")
                    .addField("Channel", `${channel}`)
                    .setColor(colors.COLOR)
                    .setTimestamp()
                const unlockedEmbed = new discord.MessageEmbed()
                    .setTitle(":unlock: Channel Unlocked!")
                    .setDescription(`This channel was unlocked by ${interaction.user}.`)
                    .setColor(colors.COLOR)
                    .setTimestamp()
                channel.send({ embeds: [unlockedEmbed] });
                interaction.reply({ embeds: [unlockedChannelEmbed] })
                if (guildDatabase.logEnabled === "true") {
                    const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                    if (!logChannel) return;
                    const embed = new discord.MessageEmbed()
                        .setColor(colors.CLEAR_COLOR)
                        .setTitle('Channel Unlocked')
                        .addField('Channel', `${channel}`)
                        .addField('Unlocked by', `${interaction.user}`)
                        .setTimestamp();
                    logChannel.send({ embeds: [embed] });
                } else {
                    return;
                }
            } else {
                interaction.reply({ embeds: [errorMain] });
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}