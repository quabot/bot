const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../../files/colors.json');
const User = require('../../../models/user');
const Guild = require('../../../models/guild');

const {errorMain, addedDatabase, clearpunNoType } = require('../../../files/embeds');

module.exports = {
    name: "clearpunishments",
    description: "Clear a users's punishments.",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "type",
            description: "A type of punishments",
            type: "STRING",
            required: true,
        },
        {
            name: "user",
            description: "A user to clear the punishments of.",
            type: "USER",
            required: true,
        }
    ],
    async execute(client, interaction) {

        const member = interaction.options.getMember('user');
        const type = interaction.options.getString('type');

        const userDatabase = User.findOne({
            guildID: interaction.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err) console.error(err);

            if (!user) {
                const newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    guildID: interaction.guild.id,
                    userID: member.id,
                    muteCount: 0,
                    warnCount: 0,
                    kickCount: 0,
                    banCount: 0
                });

                await newUser.save()
                    .catch(err => interaction.reply({ embeds: [errorMain] }));
            };
        });

        if (type === "warn" || type === "kick" || type === "mute" || type === "ban") {
            if (type === "warn") {
                userDatabase.updateOne({
                    warnCount: 0
                });
                const embed1 = new discord.MessageEmbed()
                    .setDescription(`:white_check_mark: Cleared all warnings for ${member}!`)
                    .setColor(colors.COLOR);
                interaction.followUp({ embeds: [embed1] });
            }
            if (type === "kick") {
                userDatabase.updateOne({
                    kickCount: 0
                });
                const embed2 = new discord.MessageEmbed()
                    .setDescription(`:white_check_mark: Cleared all kicks for ${member}!`)
                    .setColor(colors.COLOR);
                interaction.followUp({ embeds: [embed2] });
            }
            if (type === "mute") {
                userDatabase.updateOne({
                    muteCount: 0
                });
                const embed3 = new discord.MessageEmbed()
                    .setDescription(`:white_check_mark: Cleared all mutes for ${member}!`)
                    .setColor(colors.COLOR);
                interaction.followUp({ embeds: [embed3] });
            }
            if (type === "ban") {
                userDatabase.updateOne({
                    banCount: 0
                });
                const embed4 = new discord.MessageEmbed()
                    .setDescription(`:white_check_mark: Cleared all bans for ${member}!`)
                    .setColor(colors.COLOR);
                interaction.followUp({ embeds: [embed4] });
            }
        } else return interaction.followUp({ embeds: [clearpunNoType] });

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

        if (settings.enableLog === "true") {
            const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;

            const embed = new discord.MessageEmbed()
                .setColor(colors.CLEAR_COLOR)
                .setTitle(`User\'s ${type} Reset`)
                .addField('Punishment', `${type}`)
                .addField('User', `${member}`)
                .addField('User ID', `${member.id}`)
                .addField('Reset By', `${interaction.user}`);
            logChannel.send({ embeds: [embed] });
        } else {
            return;
        }
    }
}