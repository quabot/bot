const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const Guild = require('../../models/guild');
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

        const settings = await Guild.findOne({
            guildID: interaction.guild.id
        }, (err, guild) => {
            if (err) interaction.reply({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    logChannelID: none,
                    enableLog: true,
                    enableSwearFilter: false,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: none,
                    suggestEnabled: true,
                    suggestChannelID: none,
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                    closedTicketCategoryName: "Closed Tickets",
                    welcomeEnabled: true,
                    welcomeChannelID: none,
                    enableNSFWContent: false,
                });
        
                newGuild.save()
                    .catch(err => interaction.reply({ embeds: [errorMain] }));
        
                return interaction.reply({ embeds: [addedDatabase] });
            }
        });

        if (settings.suggestEnabled === "false") return interaction.reply({ embeds: [suggestDisabled] });
        const suggestChannel = interaction.guild.channels.cache.get(settings.suggestChannelID);
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

        if (settings.enableLog === "true") {
            const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;
            const embed2 = new discord.MessageEmbed()
                .setColor(colors.KICK_COLOR)
                .setTitle("New Suggestion")
                .addField("Suggested by:", `${interaction.user}`, true)
                .addField("User ID:", `${interaction.user.id}`, true)
                .addField("Suggestion:", `${suggestionContent}`)
                .setTimestamp()
            logChannel.send({ embeds: [embed2   ] });
        } else {
            return;
        }
    }
}