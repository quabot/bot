const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const config = require('../../files/settings.json');
const { errorMain, noPollChannelConfigured, noMSG, addedDatabase, pollDisabled } = require('../../files/embeds');

module.exports = {
    name: "endpoll",
    description: "Close a poll.",
    permission: "MANAGE_MESSAGES",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "poll-id",
            description: "Poll ID",
            type: "INTEGER",
            required: true,
        },
    ],
    async execute(client, interaction) {

        try {
            const pollId = interaction.options.getInteger('poll-id');
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
                        levelEnabled: false,
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

            if (guildDatabase.pollsEnabled === "false") return interaction.reply({ embeds: [pollDisabled] });
            const pollChannel = interaction.guild.channels.cache.get(guildDatabase.pollChannelID);
            if (!pollChannel) return interaction.reply({ embeds: [noPollChannelConfigured] });

            const Ids = require('../../schemas/IdsSchema');
            const pollDatabase = await Ids.findOne({
                guildId: interaction.guild.id,
                pollId: pollId,
            }, (err, ids) => {
                if (err) console.error(err);
                if (!ids) {
                    return interaction.reply({ embeds: [noMSG] });
                }
            });

            const msgId = pollDatabase.pollMessageId;
            const pollContent = pollDatabase.pollName;

            pollChannel.messages.fetch(msgId)
                .then(message => {
                    let result = "did not have a winner";
                    let color = "COLOR";
                    message.reactions.resolve('⬆️').users.fetch().then(userList => {
                        const upvotes = userList.size;
                        message.reactions.resolve('⬇️').users.fetch().then(userList => {
                            const downvotes = userList.size;
                            if (downvotes > upvotes) result = "failed"
                            if (upvotes > downvotes) result = "won"
                            if (downvotes > upvotes) color = "#de3131"
                            if (upvotes > downvotes) color = "#70ff69"
                            if (upvotes === downvotes) color = "#4e71e6"
                            if (upvotes === downvotes) result = "tied"
                            const winEmbed = new discord.MessageEmbed()
                                .setTitle(`${pollContent}`)
                                .setDescription(`Voting for this poll is over, the poll ${result}!\n\n:arrow_up:  ${upvotes} | :arrow_down:  ${downvotes}`)
                                .setTimestamp()
                                .setFooter(`ID: ${pollDatabase.pollId}`)
                                .setColor(`${color}`)
                            message.edit({ embeds: [winEmbed] });
                            const replyEmbed = new discord.MessageEmbed()
                                .setTitle(`Poll Ended`)
                                .setDescription(`Voting for the poll ended, the poll ${result}!`)
                                .setTimestamp()
                                .setColor(colors.COLOR)
                            interaction.reply({ embeds: [replyEmbed] });
                        });
                    });
                })
                .catch(err => {
                    interaction.reply({ embeds: [noMSG] });
                });

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;
                const embed2 = new discord.MessageEmbed()
                    .setColor(colors.POLL_COLOR)
                    .setTitle("Poll ended")
                    .addField(`Poll`, `${pollContent}`)
                    .addField(`Poll ID`, `${pollId}`)
                    .addField("Message ID", `${msgId}`)
                    .addField("Ended by", `${interaction.user}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed2] });
            } else {
                return;
            }
        } catch (e) {
            interaction.reply({ embeds: [noMSG] });
            console.log(e);
            return;
        }
    }
}