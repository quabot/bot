const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const { errorMain, noSuggestChannelConfigured, suggestSucces, suggestTooShort, addedDatabase, suggestDisabled } = require('../../files/embeds');

module.exports = {
    name: "suggest",
    description: "This command allows you to leave a suggestion.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "suggestion",
            description: "Your suggestion for everyone to vote on.",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {

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

        if (guildDatabase.suggestEnabled === "false") return interaction.reply({ embeds: [suggestDisabled] });
        const suggestChannel = interaction.guild.channels.cache.get(guildDatabase.suggestChannelID);
        if (!suggestChannel) return interaction.reply({ embeds: [noSuggestChannelConfigured] });

        const suggestionContent = interaction.options.getString('suggestion');
        if (suggestionContent.length < 3) return interaction.reply({ embeds: [suggestTooShort] });

        const embed = new discord.MessageEmbed()
            .setColor(colors.SUGGEST_COLOR)
            .setTitle("New Suggestion!")
            .addField("Suggested by:", `${interaction.user}`)
            .addField("Suggestion:", `${suggestionContent}`)
            .setFooter("Vote with the 🟢 and 🔴 emotes below this message!")
            .setTimestamp()
        let sentsug = suggestChannel.send({ embeds: [embed] }).then(msg => {
            msg.react('🟢');
            msg.react('🔴');
        });
        interaction.reply({ embeds: [suggestSucces] });

        if (guildDatabase.logEnabled === "true") {
            const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!logChannel) return;
            const embed2 = new discord.MessageEmbed()
                .setColor(colors.KICK_COLOR)
                .setTitle("New Suggestion")
                .addField("Suggested by:", `${interaction.user}`, true)
                .addField("User ID:", `${interaction.user.id}`, true)
                .addField("Suggestion:", `${suggestionContent}`)
                .setTimestamp()
            logChannel.send({ embeds: [embed2] });
        } else {
            return;
        }
    }
}