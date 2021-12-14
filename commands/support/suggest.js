const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const { errorMain, noSuggestChannelConfigured, suggestSucces, addedDatabase, suggestDisabled } = require('../../files/embeds');

module.exports = {
    name: "suggest",
    description: "Leave a suggestion.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "suggestion",
            description: "Your suggestion",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {

        try {
            const suggestion = interaction.options.getString('suggestion');

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

            const Bot = require('../../schemas/BotSchema');
            const botSettings = await Bot.findOne({
                verifToken: 1,
            }, (err, bot) => {
                if (err) console.error(err);
                if (!bot) {
                    const newBot = new Bot({
                        verifToken: 1,
                        pollId: 0,
                        suggestId: 0,
                    });
                    newBot.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });
            const newSuggestId = botSettings.suggestId + 1;
            await botSettings.updateOne({
                suggestId: newSuggestId,
            });

            const embed = new discord.MessageEmbed()
                .setTitle(`New Suggestion!`)
                .addField('Suggested by', `${interaction.user}`)
                .addField(`Suggestion`, `${suggestion}`)
                .setFooter(`Vote on this suggestion with the 🟢 and 🔴 emojis! • Suggestion ID: ${newSuggestId}`)
                .setTimestamp()
                .setColor(colors.SUGGEST_COLOR)
            suggestChannel.send({ embeds: [embed] }).then(m => {
                m.react('🟢');
                m.react('🔴');
                const Ids = require('../../schemas/IdsSchema');
                const newSuggestion = new Ids({
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    suggestionMessageId: m.id,
                    suggestionId: newSuggestId,
                    suggestionName: suggestion,
                });
                newSuggestion.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [errorMain] });
                    });
            });
            const suggestionMade = new discord.MessageEmbed()
                .setTitle(":white_check_mark: Succes!")
                .setDescription(`You have succesfully left a suggestion!`)
                .setColor(colors.SUGGEST_COLOR)
                .setTimestamp()
            interaction.reply({ embeds: [suggestionMade] });

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;
                const embed2 = new discord.MessageEmbed()
                    .setColor(colors.SUGGEST_COLOR)
                    .setTitle("New Suggestion")
                    .addField(`Suggested By`, `${interaction.user}`)
                    .addField(`Suggestion`, `${suggestion}`)
                    .addField(`User-Id`, `${interaction.user.id}`)
                    .setFooter(`ID: ${newSuggestId}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed2] });
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