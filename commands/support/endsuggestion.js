const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const { errorMain, noSuggestChannelConfigured, noMSG, addedDatabase, suggestDisabled } = require('../../files/embeds');

module.exports = {
    name: "endsuggestion",
    description: "Close a suggestion.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "suggestion-id",
            description: "Suggestion ID",
            type: "INTEGER",
            required: true,
        },
    ],
    async execute(client, interaction) {

        try {
            const suggestionId = interaction.options.getInteger('suggestion-id');
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

            if (guildDatabase.suggestEnabled === "false") return interaction.reply({ embeds: [suggestDisabled] });
            const suggestChannel = interaction.guild.channels.cache.get(guildDatabase.suggestChannelID);
            if (!suggestChannel) return interaction.reply({ embeds: [noSuggestChannelConfigured] });

            const Ids = require('../../schemas/IdsSchema');
            const suggestDatabase = await Ids.findOne({
                guildId: interaction.guild.id,
                suggestionId: suggestionId,
            }, (err, ids) => {
                if (err) console.error(err);
                if (!ids) {
                    return interaction.reply({ embeds: [noMSG] });
                }
            });

            const msgId = suggestDatabase.suggestionMessageId;
            const suggestionContent = suggestDatabase.suggestionName;

            suggestChannel.messages.fetch(msgId)
                .then(message => {
                console.log(message)
                    let result = "did not have a winner";
                    let color = "COLOR";
                    message.reactions.resolve('🟢').users.fetch().then(userList => {
                        const upvotes = userList.size;
                        message.reactions.resolve('🔴').users.fetch().then(userList => {
                            const downvotes = userList.size;
                            if (downvotes > upvotes) result = "failed"
                            if (upvotes > downvotes) result = "won"
                            if (downvotes > upvotes) color = "#de3131"
                            if (upvotes > downvotes) color = "#70ff69"
                            if (upvotes === downvotes) color = "#4e71e6"
                            if (upvotes === downvotes) result = "tied"
                            const winEmbed = new discord.MessageEmbed()
                                .setTitle(`New Suggestion!`)
                                .setDescription(`Voting has closed, the suggestion has ${result}!`)
                                .addField(`Suggestion`, `${suggestionContent}`)
                                .setFooter(`Voting for this suggestion has closed! • Suggestion ID: ${suggestionId}`)
                                .setTimestamp()
                                .setColor(color)
                            message.edit({ embeds: [winEmbed] });
                            const replyEmbed = new discord.MessageEmbed()
                                .setTitle(`Suggestion Ended`)
                                .setDescription(`Voting for the suggestion ended, the suggestion ${result}!`)
                                .addField(`Suggestion`, `${suggestionContent}`)
                                .setTimestamp()
                                .setColor(colors.COLOR)
                            interaction.reply({ embeds: [replyEmbed] });
                        });
                    });
                })
                .catch(err => {
                    console.log(err)
                    interaction.reply({ embeds: [noMSG] });
                });

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;
                const embed2 = new discord.MessageEmbed()
                    .setColor(colors.SUGGEST_COLOR)
                    .setTitle("Suggestion ended")
                    .addField(`Suggestion`, `${suggestionContent}`)
                    .addField(`Suggestion ID`, `${suggestionId}`)
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