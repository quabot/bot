const { MessageEmbed } = require('discord.js')

const { COLOR_MAIN } = require('../../files/colors.json')
const { error, added } = require('../../embeds/general');
const noSuggestChannelConfigured = new MessageEmbed()
    .setTitle(":x: There is no suggestions channel setup!")
    .setColor(COLOR_MAIN)
    

const { suggestDis } = require('../../embeds/support');

module.exports = {
    name: "endsuggestion",
    description: "Close a suggestion.",
    permission: "MANAGE_MESSAGES",
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
                        pollID: 0,
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

            const Ids = require('../../schemas/IdsSchema');
            const suggestDatabase = await Ids.findOne({
                guildId: interaction.guild.id,
                suggestionId: suggestionId,
            }, (err, ids) => {
                if (err) console.error(err);
                if (!ids) {
                    return interaction.reply({ ephemeral: true, content: "Could not find that message!" });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!suggestDatabase) return;
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
                            const winEmbed = new MessageEmbed()
                                .setTitle(`New Suggestion!`)
                                .setDescription(`Voting has closed, the suggestion has ${result}!`)
                                .addField(`Suggestion`, `${suggestionContent}`)
                                .setFooter(`Voting for this suggestion has closed! • Suggestion ID: ${suggestionId}`)
                                
                                .setColor(COLOR_MAIN)
                            message.edit({ embeds: [winEmbed] }).catch(err => console.log(err));
                            const replyEmbed = new MessageEmbed()
                                .setTitle(`Suggestion Ended`)
                                .setDescription(`Voting for the suggestion ended, the suggestion ${result}!`)
                                .addField(`Suggestion`, `${suggestionContent}`)
                                
                                .setColor(COLOR_MAIN)
                            interaction.reply({ embeds: [replyEmbed] }).catch(err => console.log(err));
                        });
                    });
                })
                .catch(err => {
                    console.log(err)
                    return;
                });

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;
                const embed2 = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle("Suggestion ended")
                    .addField(`Suggestion`, `${suggestionContent}`)
                    .addField(`Suggestion ID`, `${suggestionId}`)
                    .addField("Message ID", `${msgId}`)
                    .addField("Ended by", `${interaction.user}`)
                    
                logChannel.send({ embeds: [embed2] }).catch(err => console.log(err));
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: serverinfo`)] }).catch(err => console.log(err));;
            return;
        }
    }
}