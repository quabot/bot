const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const config = require('../../files/settings.json');
const { errorMain, noPollChannelConfigured, suggestSucces, addedDatabase, pollDisabled } = require('../../files/embeds');

module.exports = {
    name: "poll",
    description: "Start a poll.",
    permission: "MANAGE_MESSAGES",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [{
        name: "poll",
        description: "Poll topic",
        type: "STRING",
        required: true,
    }, ],
    async execute(client, interaction) {

        try {
            const poll = interaction.options.getString('poll');

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
            const pollId = botSettings.pollId + 1;
            await botSettings.updateOne({
                pollId: pollId,
            });

            const embed = new discord.MessageEmbed()
                .setTitle(`${poll}`)
                .setDescription("Vote on this poll with the :arrow_up: :arrow_down: emojis.")
                .addField("Created by", `${interaction.user}`)
                .setFooter(`ID: ${pollId}`)
                .setTimestamp()
                .setColor(colors.POLL_COLOR)
            pollChannel.send({ embeds: [embed] }).then(m => {
                m.react('⬆️');
                m.react('⬇️');
                const Ids = require('../../schemas/IdsSchema');
                const newPoll = new Ids({
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    pollMessageId: m.id,
                    pollId: pollId,
                    pollName: poll,
                });
                newPoll.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [errorMain] });
                    });
            });
            const pollMade = new discord.MessageEmbed()
                .setTitle(":white_check_mark: Poll created!")
                .setDescription(`Vote in ${pollChannel}!`)
                .setColor(colors.POLL_COLOR)
                .setTimestamp()
            interaction.reply({ embeds: [pollMade] });

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;
                const embed2 = new discord.MessageEmbed()
                    .setColor(colors.POLL_COLOR)
                    .setTitle("New Poll")
                    .addField(`Poll`, `${poll}`)
                    .addField(`Created by`, `${interaction.user}`)
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