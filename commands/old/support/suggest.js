const { MessageEmbed } = require('discord.js')

const { COLOR_MAIN } = require('../../files/colors.json')
const { error, added } = require('../../embeds/general');
const noSuggestChannelConfigured = new MessageEmbed()
    .setTitle(":x: There is no suggestions channel setup!")
    .setColor(COLOR_MAIN)
    

const { suggestDis } = require('../../embeds/support');

module.exports = {
    name: "suggest",
    description: "Leave a suggestion.",
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
                        punishmentChannelID: "none",
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        pollEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;

            if (guildDatabase.suggestEnabled === "false") return interaction.reply({ embeds: [suggestDis] }).catch(err => console.log(err));
            const suggestChannel = interaction.guild.channels.cache.get(guildDatabase.suggestChannelID);
            if (!suggestChannel) return interaction.reply({ embeds: [noSuggestChannelConfigured] }).catch(err => console.log(err));

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
                            interaction.channel.send({ embeds: [error] });
                        });
                    return interaction.channel.send({ embeds: [added] });
                }
            }).clone().catch(function (err) { console.log(err) });

            const newSuggestId = botSettings.suggestId + 1;
            await botSettings.updateOne({
                suggestId: newSuggestId,
            });

            const embed = new MessageEmbed()
                .setTitle(`New Suggestion!`)
                .addField('Suggested by', `${interaction.user}`)
                .addField(`Suggestion`, `${suggestion}`)
                .setFooter(`Vote on this suggestion with the 🟢 and 🔴 emojis! • Suggestion ID: ${newSuggestId}`)
                
                .setColor(`GREEN`)
            suggestChannel.send({ embeds: [embed] }).then(m => {
                m.react('🟢');
                m.react('🔴');
                const Ids = require('../../IdsSchema');
                const newSuggestion = new Ids({
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    suggestionMessageId: m.id,
                    suggestionId: newSuggestId,
                    suggestionName: suggestion,
                })
                newSuggestion.save()
                    .catch(err => {
                        console.log(err);
                    });
            }).catch(err => console.log(err));
            const suggestionMade = new MessageEmbed()
                .setTitle(":white_check_mark: Succes!")
                .setDescription(`You have succesfully left a suggestion!`)
                .setColor(`GREEN`)
                
            interaction.reply({ ephemeral: true, embeds: [suggestionMade] }).catch(err => console.log(err));

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;
                const embed2 = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle("New Suggestion")
                    .addField(`Suggested By`, `${interaction.user}`)
                    .addField(`Suggestion`, `${suggestion}`)
                    .addField(`User-Id`, `${interaction.user.id}`)
                    .setFooter(`ID: ${newSuggestId}`)
                    
                logChannel.send({ embeds: [embed2] }).catch(err => console.log(err));
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: serverinfo`)] }).catch(err => console.log(err));;
            return;
        }
    }
}